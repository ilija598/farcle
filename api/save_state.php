<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$body = read_json_body();
$code = strtoupper(trim((string) ($body['code'] ?? '')));
$token = (string) ($body['token'] ?? '');
$state = $body['state'] ?? null;
$action = (string) ($body['action'] ?? 'turn');
$expectedVersion = isset($body['expectedVersion']) ? (int) $body['expectedVersion'] : 0;

if ($code === '' || $token === '' || !is_array($state)) {
    json_response(['ok' => false, 'error' => 'Missing room code, token or state.'], 400);
}

$room = find_room($code);
if ($room === null) {
    json_response(['ok' => false, 'error' => 'Room not found.'], 404);
}

$playerIndex = token_player_index($room, $token);
if ($playerIndex === null) {
    json_response(['ok' => false, 'error' => 'Invalid player token.'], 403);
}

$oldState = json_decode((string) $room['state_json'], true);
$oldVersion = (int) $room['version'];
if ($expectedVersion > 0 && $expectedVersion !== $oldVersion) {
    json_response([
        'ok' => false,
        'error' => 'Room state changed. Refreshing.',
        'state' => is_array($oldState) ? $oldState : json_decode((string) $room['state_json'], true),
        'status' => $room['status'],
        'version' => $oldVersion,
        'updatedAt' => $room['updated_at'],
    ], 409);
}
$oldCurrentPlayer = is_array($oldState) ? (int) ($oldState['currentPlayer'] ?? 0) : 0;
$allowed = $action === 'reset' || $oldCurrentPlayer === $playerIndex;
if (!$allowed && !empty($oldState['players'][$oldCurrentPlayer]['aiControlled'])) {
    $allowed = true;
}
if (!$allowed && str_starts_with($action, 'farkle:')) {
    $farklePlayer = (int) substr($action, strlen('farkle:'));
    $allowed = $oldCurrentPlayer === $farklePlayer;
}

if (!$allowed) {
    json_response(['ok' => false, 'error' => 'It is not your turn.'], 409);
}

function state_player_score(array $state, int $index): int
{
    return (int) ($state['players'][$index]['score'] ?? 0);
}

function validate_basic_state_transition(array $oldState, array $newState, string $action, int $playerIndex): ?string
{
    $players = is_array($oldState['players'] ?? null) ? $oldState['players'] : [];
    $playerCount = count($players);
    if ($playerCount < 2 || !is_array($newState['players'] ?? null) || count($newState['players']) !== $playerCount) {
        return 'Invalid players state.';
    }

    $oldCurrent = (int) ($oldState['currentPlayer'] ?? 0);
    $newCurrent = (int) ($newState['currentPlayer'] ?? 0);
    if ($oldCurrent < 0 || $oldCurrent >= $playerCount || $newCurrent < 0 || $newCurrent >= $playerCount) {
        return 'Invalid current player.';
    }

    for ($index = 0; $index < $playerCount; $index += 1) {
        $oldScore = state_player_score($oldState, $index);
        $newScore = state_player_score($newState, $index);
        if ($newScore < -10000 || $newScore > 20000) {
            return 'Invalid score range.';
        }
    }

    $oldTurnPoints = (int) ($oldState['turnPoints'] ?? 0);
    $newTurnPoints = (int) ($newState['turnPoints'] ?? 0);
    if ($newTurnPoints < 0 || $newTurnPoints > 10000) {
        return 'Invalid turn points.';
    }

    if ($action === 'turn') {
        for ($index = 0; $index < $playerCount; $index += 1) {
            $oldScore = state_player_score($oldState, $index);
            $newScore = state_player_score($newState, $index);
            $expectedScore = $index === $oldCurrent ? $oldScore + $oldTurnPoints : $oldScore;
            if ($newScore !== $expectedScore) {
                return 'Invalid score update.';
            }
        }
    } elseif (str_starts_with($action, 'farkle:')) {
        for ($index = 0; $index < $playerCount; $index += 1) {
            $oldScore = state_player_score($oldState, $index);
            $newScore = state_player_score($newState, $index);
            if ($index === $oldCurrent) {
                if ($newScore !== $oldScore && $newScore !== $oldScore - 1000) {
                    return 'Invalid Farkle score update.';
                }
            } elseif ($newScore !== $oldScore) {
                return 'Invalid score update.';
            }
        }
    } elseif ($action !== 'reset') {
        for ($index = 0; $index < $playerCount; $index += 1) {
            if (state_player_score($oldState, $index) !== state_player_score($newState, $index)) {
                return 'Scores can change only when a turn ends.';
            }
        }
    }

    if ($action === 'roll') {
        if ($newCurrent !== $oldCurrent || $newTurnPoints !== $oldTurnPoints) {
            return 'Roll cannot change player or turn points.';
        }
        if (empty($newState['hasRolled'])) {
            return 'Roll must mark dice as rolled.';
        }
    } elseif ($action === 'keep') {
        if ($newCurrent !== $oldCurrent || $newTurnPoints < $oldTurnPoints) {
            return 'Keep cannot change player or reduce turn points.';
        }
    } elseif ($action === 'turn') {
        $expectedNext = ($oldCurrent + 1) % $playerCount;
        if (empty($newState['gameOver']) && $newCurrent !== $expectedNext) {
            return 'Turn must pass to the next player.';
        }
    } elseif (str_starts_with($action, 'farkle:')) {
        $expectedNext = ($oldCurrent + 1) % $playerCount;
        if (empty($newState['gameOver']) && $newCurrent !== $expectedNext) {
            return 'Farkle must pass to the next player.';
        }
    } elseif ($action !== 'reset') {
        return 'Unknown action.';
    }

    return null;
}

if (is_array($oldState)) {
    $validationError = validate_basic_state_transition($oldState, $state, $action, $playerIndex);
    if ($validationError !== null) {
        json_response(['ok' => false, 'error' => $validationError], 422);
    }
}

$nowMs = (int) floor(microtime(true) * 1000);
if ($action === 'roll' && is_array($oldState) && !empty($oldState['turnDeadlineAt'])) {
    $state['turnDeadlineAt'] = (int) $oldState['turnDeadlineAt'];
} else {
    $state['turnDeadlineAt'] = $nowMs + 60000;
}

if (is_array($oldState)) {
    $oldChat = is_array($oldState['chatMessages'] ?? null) ? $oldState['chatMessages'] : [];
    $newChat = is_array($state['chatMessages'] ?? null) ? $state['chatMessages'] : [];
    $mergedChat = [];
    foreach (array_merge($oldChat, $newChat) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $key = (string) ($item['at'] ?? '') . '|' . (string) ($item['name'] ?? '') . '|' . (string) ($item['text'] ?? '');
        $mergedChat[$key] = [
            'name' => (string) ($item['name'] ?? 'Igrac'),
            'text' => (string) ($item['text'] ?? ''),
            'at' => (int) ($item['at'] ?? 0),
        ];
    }
    $mergedChat = array_values($mergedChat);
    usort($mergedChat, static fn(array $a, array $b): int => ($a['at'] <=> $b['at']));
    $state['chatMessages'] = array_slice($mergedChat, -60);
}

$status = !empty($state['gameOver']) ? 'finished' : (string) $room['status'];
$stmt = db()->prepare('UPDATE rooms SET state_json = ?, status = ?, version = version + 1 WHERE id = ? AND version = ?');
$stmt->execute([json_encode($state, JSON_UNESCAPED_SLASHES), $status, $room['id'], $oldVersion]);

if ($stmt->rowCount() === 0) {
    $room = find_room($code);
    json_response([
        'ok' => false,
        'error' => 'Room state changed. Refreshing.',
        'state' => json_decode((string) $room['state_json'], true),
        'status' => $room['status'],
        'version' => (int) $room['version'],
        'updatedAt' => $room['updated_at'],
    ], 409);
}

$room = find_room($code);
json_response([
    'ok' => true,
    'code' => $room['code'],
    'playerIndex' => $playerIndex,
    'state' => json_decode((string) $room['state_json'], true),
    'status' => $room['status'],
    'version' => (int) $room['version'],
    'updatedAt' => $room['updated_at'],
]);
