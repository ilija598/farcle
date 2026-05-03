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

$playerIndex = token_player_index($room, $token);
if ($playerIndex === null) {
    json_response(['ok' => false, 'error' => 'Invalid player token.'], 403);
}

$state = json_decode((string) $room['state_json'], true);
if (!is_array($state)) {
    json_response(['ok' => false, 'error' => 'Invalid room state.'], 500);
}

$playerCount = count(is_array($state['players'] ?? null) ? $state['players'] : []);
$playerCount = max(2, $playerCount);
$winnerIndex = ($playerIndex + 1) % $playerCount;
$forfeitName = (string) ($state['players'][$playerIndex]['name'] ?? ('Igrac ' . ($playerIndex + 1)));
$winnerName = (string) ($state['players'][$winnerIndex]['name'] ?? ('Igrac ' . ($winnerIndex + 1)));

$state['players'][$winnerIndex]['score'] = 10050;
$state['players'][$playerIndex]['aiControlled'] = false;
$state['turnPoints'] = 0;
$state['currentPlayer'] = $winnerIndex;
$state['gameOver'] = true;
$state['hasRolled'] = false;
$state['turnStarted'] = false;
$state['mustKeepAfterFullReset'] = false;
$state['mustKeepFromCurrentRoll'] = false;
$state['turnDeadlineAt'] = (int) floor(microtime(true) * 1000);
$state['history'] = is_array($state['history'] ?? null) ? $state['history'] : [];
array_unshift($state['history'], ['label' => $forfeitName . ' je izasao, ' . $winnerName . ' pobedjuje', 'points' => 10050, 'at' => $state['turnDeadlineAt']]);
$state['history'] = array_slice($state['history'], 0, 14);

$stmt = db()->prepare('UPDATE rooms SET state_json = ?, status = ?, version = version + 1 WHERE id = ? AND version = ?');
$stmt->execute([json_encode($state, JSON_UNESCAPED_SLASHES), 'finished', $room['id'], $oldVersion]);

if ($stmt->rowCount() === 0) {
    $room = find_room($code);
    json_response([
        'ok' => true,
        'state' => json_decode((string) $room['state_json'], true),
        'status' => $room['status'],
        'version' => (int) $room['version'],
        'updatedAt' => $room['updated_at'],
    ]);
}

$room = find_room($code);
json_response([
    'ok' => true,
    'state' => json_decode((string) $room['state_json'], true),
    'status' => $room['status'],
    'version' => (int) $room['version'],
    'updatedAt' => $room['updated_at'],
]);
