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
if (!hash_equals(room_host_token($room), $token)) {
    json_response(['ok' => false, 'error' => 'Samo host moze da startuje sobu.'], 403);
}
if ($room['status'] !== 'waiting') {
    json_response(['ok' => false, 'error' => 'Soba nije u lobby statusu.'], 409);
}

$tokens = room_player_tokens($room);
if (count($tokens) < 2) {
    json_response(['ok' => false, 'error' => 'Treba bar 2 igraca za start.'], 409);
}

$state = json_decode((string) $room['state_json'], true);
if (!is_array($state)) {
    json_response(['ok' => false, 'error' => 'Invalid room state.'], 500);
}

$state['currentPlayer'] = 0;
$state['turnPoints'] = 0;
$state['turnStarted'] = true;
$state['gameOver'] = false;
$state['hasRolled'] = false;
$state['mustKeepAfterFullReset'] = false;
$state['mustKeepFromCurrentRoll'] = false;
$state['turnDeadlineAt'] = (int) floor(microtime(true) * 1000) + 60000;
$state['dice'] = [];
for ($i = 0; $i < 6; $i += 1) {
    $state['dice'][] = [
        'id' => bin2hex(random_bytes(8)),
        'value' => 1,
        'selected' => false,
        'special' => false,
    ];
}

$stmt = db()->prepare('UPDATE rooms SET state_json = ?, status = ?, version = version + 1 WHERE id = ? AND status = ? AND version = ?');
$stmt->execute([json_encode($state, JSON_UNESCAPED_SLASHES), 'active', $room['id'], 'waiting', $oldVersion]);

if ($stmt->rowCount() === 0) {
    json_response(['ok' => false, 'error' => 'Soba se promenila. Pokusaj ponovo.'], 409);
}

$room = find_room($code);
json_response([
    'ok' => true,
    'code' => $room['code'],
    'playerIndex' => 0,
    'state' => json_decode((string) $room['state_json'], true),
    'status' => $room['status'],
    'version' => (int) $room['version'],
    'updatedAt' => $room['updated_at'],
]);
