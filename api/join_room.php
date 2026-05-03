<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$body = read_json_body();
$code = strtoupper(trim((string) ($body['code'] ?? '')));

if ($code === '') {
    json_response(['ok' => false, 'error' => 'Missing room code.'], 400);
}

$room = find_room($code);
if ($room === null) {
    json_response(['ok' => false, 'error' => 'Room not found.'], 404);
}
$oldVersion = (int) $room['version'];

$token = (string) ($body['token'] ?? '');
$existingIndex = $token !== '' ? token_player_index($room, $token) : null;
if ($existingIndex !== null) {
    json_response([
        'ok' => true,
        'code' => $room['code'],
        'token' => $token,
        'playerIndex' => $existingIndex,
        'state' => json_decode((string) $room['state_json'], true),
        'status' => $room['status'],
        'version' => (int) $room['version'],
        'updatedAt' => $room['updated_at'],
    ]);
}

if ($room['status'] !== 'waiting') {
    json_response(['ok' => false, 'error' => 'Partija je vec startovana.'], 409);
}

$tokens = room_player_tokens($room);
$maxPlayers = room_max_players($room);
if (count($tokens) >= $maxPlayers) {
    json_response(['ok' => false, 'error' => 'Room is already full.'], 409);
}

$token = random_token();
$tokens[] = $token;
$playerIndex = count($tokens) - 1;
$playerName = substr(trim(preg_replace('/\s+/', ' ', (string) ($body['playerName'] ?? ''))), 0, 18);
if ($playerName === '') {
    $playerName = 'Igrac ' . ($playerIndex + 1);
}
$state = json_decode((string) $room['state_json'], true);
if (!is_array($state)) {
    json_response(['ok' => false, 'error' => 'Invalid room state.'], 500);
}

$state['maxPlayers'] = $maxPlayers;
$state['players'] = is_array($state['players'] ?? null) ? $state['players'] : [];
$state['players'][$playerIndex] = [
    'name' => $playerName,
    'score' => 0,
    'strikes' => 0,
    'timeoutStrikes' => 0,
    'aiControlled' => false,
];
$state['players'] = array_values($state['players']);
$state['savedDiceValues'] = is_array($state['savedDiceValues'] ?? null) ? $state['savedDiceValues'] : [];
$state['savedDiceValues'][$playerIndex] = [];
$state['savedDiceValues'] = array_values($state['savedDiceValues']);
$state['chatMessages'] = is_array($state['chatMessages'] ?? null) ? $state['chatMessages'] : [];

$player2Token = $room['player2_token'] ?: ($playerIndex === 1 ? $token : null);
$stmt = db()->prepare('UPDATE rooms SET player2_token = ?, player_tokens_json = ?, state_json = ?, version = version + 1 WHERE id = ? AND status = ? AND version = ?');
$stmt->execute([
    $player2Token,
    json_encode($tokens, JSON_UNESCAPED_SLASHES),
    json_encode($state, JSON_UNESCAPED_SLASHES),
    $room['id'],
    'waiting',
    $oldVersion,
]);

if ($stmt->rowCount() === 0) {
    json_response(['ok' => false, 'error' => 'Soba se promenila. Osvezi listu soba.'], 409);
}

$room = find_room((string) $room['code']);
json_response([
    'ok' => true,
    'code' => $room['code'],
    'token' => $token,
    'playerIndex' => $playerIndex,
    'state' => json_decode((string) $room['state_json'], true),
    'status' => $room['status'],
    'version' => (int) $room['version'],
    'updatedAt' => $room['updated_at'],
]);
