<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$body = read_json_body();
$code = strtoupper(trim((string) ($body['code'] ?? '')));
$token = (string) ($body['token'] ?? '');

if ($code === '' || $token === '') {
    json_response(['ok' => false, 'error' => 'Missing room code or token.'], 400);
}

$room = find_room($code);
if ($room === null) {
    json_response(['ok' => false, 'error' => 'Room not found.'], 404);
}
$oldVersion = (int) $room['version'];

if (token_player_index($room, $token) === null) {
    json_response(['ok' => false, 'error' => 'Invalid player token.'], 403);
}

$state = json_decode((string) $room['state_json'], true);
if (!is_array($state)) {
    json_response(['ok' => false, 'error' => 'Invalid room state.'], 500);
}

$deadline = (int) ($state['turnDeadlineAt'] ?? 0);
$nowMs = (int) floor(microtime(true) * 1000);
if ($deadline <= 0 || $nowMs < $deadline) {
    json_response([
        'ok' => true,
        'changed' => false,
        'state' => $state,
        'status' => $room['status'],
        'version' => (int) $room['version'],
        'updatedAt' => $room['updated_at'],
    ]);
}

$currentPlayer = (int) ($state['currentPlayer'] ?? 0);
$playerCount = count(is_array($state['players'] ?? null) ? $state['players'] : []);
if ($playerCount < 2) {
    $playerCount = 2;
}
if ($currentPlayer < 0 || $currentPlayer >= $playerCount) {
    $currentPlayer = 0;
}
$opponentPlayer = ($currentPlayer + 1) % $playerCount;

if (!isset($state['players'][$currentPlayer]) || !is_array($state['players'][$currentPlayer])) {
    json_response(['ok' => false, 'error' => 'Invalid player state.'], 500);
}

$playerName = (string) ($state['players'][$currentPlayer]['name'] ?? ('Igrac ' . ($currentPlayer + 1)));
$timeoutStrikes = (int) ($state['players'][$currentPlayer]['timeoutStrikes'] ?? 0);
$timeoutStrikes += 1;
$state['players'][$currentPlayer]['timeoutStrikes'] = $timeoutStrikes;

$historyText = $playerName . ': istekao potez (' . $timeoutStrikes . '/2)';
if ($timeoutStrikes >= 2) {
    $state['players'][$currentPlayer]['aiControlled'] = true;
    $historyText = $playerName . ': diskvalifikovan, AI preuzima';
}

$state['history'] = is_array($state['history'] ?? null) ? $state['history'] : [];
array_unshift($state['history'], ['label' => $historyText, 'points' => 0, 'at' => $nowMs]);
$state['history'] = array_slice($state['history'], 0, 14);

$state['turnPoints'] = 0;
$state['savedDiceValues'][$currentPlayer] = [];
$state['dice'] = [];
for ($i = 0; $i < 6; $i += 1) {
    $state['dice'][] = [
        'id' => bin2hex(random_bytes(8)),
        'value' => 1,
        'selected' => false,
        'special' => false,
    ];
}
$state['hasRolled'] = false;
$state['turnStarted'] = true;
$opponentScore = (int) ($state['players'][$opponentPlayer]['score'] ?? 0);
$timedOutScore = (int) ($state['players'][$currentPlayer]['score'] ?? 0);
$finishLeaderIndex = $state['finishLeaderIndex'] ?? null;
if ($finishLeaderIndex !== null) {
    $finishLeaderIndex = (int) $finishLeaderIndex;
}
if ($finishLeaderIndex === null || $finishLeaderIndex < 0 || $finishLeaderIndex >= $playerCount) {
    $finishLeaderIndex = $opponentScore >= 10000 ? $opponentPlayer : null;
}

$state['gameOver'] = $finishLeaderIndex !== null
    && $currentPlayer !== $finishLeaderIndex
    && $timedOutScore < (int) ($state['players'][$finishLeaderIndex]['score'] ?? 0)
    && $opponentPlayer === $finishLeaderIndex;

if ($state['gameOver']) {
    $state['finishLeaderIndex'] = null;
} elseif ($finishLeaderIndex !== null && $currentPlayer !== $finishLeaderIndex && $timedOutScore >= (int) ($state['players'][$finishLeaderIndex]['score'] ?? 0)) {
    $state['finishLeaderIndex'] = $currentPlayer;
} elseif ($timedOutScore >= 10000) {
    $state['finishLeaderIndex'] = $currentPlayer;
} else {
    $state['finishLeaderIndex'] = $finishLeaderIndex;
}
$state['mustKeepAfterFullReset'] = false;
$state['mustKeepFromCurrentRoll'] = false;
$state['currentPlayer'] = $opponentPlayer;
$state['turnDeadlineAt'] = $nowMs + 60000;

if ($state['gameOver']) {
    array_unshift($state['history'], [
        'label' => (string) ($state['players'][$opponentPlayer]['name'] ?? ('Igrac ' . ($opponentPlayer + 1))) . ': pobeda posle isteka poteza',
        'points' => $opponentScore,
        'at' => $nowMs,
    ]);
    $state['history'] = array_slice($state['history'], 0, 14);
}

$status = !empty($state['gameOver']) ? 'finished' : (string) $room['status'];
$stmt = db()->prepare('UPDATE rooms SET state_json = ?, status = ?, version = version + 1 WHERE id = ? AND version = ?');
$stmt->execute([json_encode($state, JSON_UNESCAPED_SLASHES), $status, $room['id'], $oldVersion]);

if ($stmt->rowCount() === 0) {
    $room = find_room($code);
    json_response([
        'ok' => true,
        'changed' => false,
        'state' => json_decode((string) $room['state_json'], true),
        'status' => $room['status'],
        'version' => (int) $room['version'],
        'updatedAt' => $room['updated_at'],
    ]);
}

$room = find_room($code);
json_response([
    'ok' => true,
    'changed' => true,
    'state' => json_decode((string) $room['state_json'], true),
    'status' => $room['status'],
    'version' => (int) $room['version'],
    'updatedAt' => $room['updated_at'],
]);
