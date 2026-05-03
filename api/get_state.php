<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$code = strtoupper(trim((string) ($_GET['code'] ?? '')));
$token = (string) ($_GET['token'] ?? '');
if ($code === '' || $token === '') {
    json_response(['ok' => false, 'error' => 'Missing room code or token.'], 400);
}

$room = find_room($code);
if ($room === null) {
    json_response(['ok' => false, 'error' => 'Room not found.'], 404);
}

$playerIndex = token_player_index($room, $token);
if ($playerIndex === null) {
    json_response(['ok' => false, 'error' => 'Invalid player token.'], 403);
}

json_response([
    'ok' => true,
    'code' => $room['code'],
    'playerIndex' => $playerIndex,
    'token' => $token,
    'state' => json_decode((string) $room['state_json'], true),
    'status' => $room['status'],
    'version' => (int) $room['version'],
    'updatedAt' => $room['updated_at'],
]);
