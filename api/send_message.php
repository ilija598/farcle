<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$body = read_json_body();
$code = strtoupper(trim((string) ($body['code'] ?? '')));
$token = (string) ($body['token'] ?? '');
$text = trim((string) ($body['text'] ?? ''));

if ($code === '' || $token === '' || $text === '') {
    json_response(['ok' => false, 'error' => 'Missing room code, token or text.'], 400);
}

$room = find_room($code);
if ($room === null) {
    json_response(['ok' => false, 'error' => 'Room not found.'], 404);
}

$playerIndex = token_player_index($room, $token);
if ($playerIndex === null) {
    json_response(['ok' => false, 'error' => 'Invalid player token.'], 403);
}

$text = substr(preg_replace('/\s+/', ' ', $text), 0, 180);
$message = [
    'name' => 'Igrac ' . ($playerIndex + 1),
    'text' => $text,
    'at' => (int) floor(microtime(true) * 1000),
];

for ($attempt = 0; $attempt < 2; $attempt += 1) {
    $state = json_decode((string) $room['state_json'], true);
    if (!is_array($state)) {
        json_response(['ok' => false, 'error' => 'Invalid room state.'], 500);
    }

    $message['name'] = (string) ($state['players'][$playerIndex]['name'] ?? $message['name']);
    $state['chatMessages'] = is_array($state['chatMessages'] ?? null) ? $state['chatMessages'] : [];
    $state['chatMessages'][] = $message;
    $state['chatMessages'] = array_slice($state['chatMessages'], -60);

    $stmt = db()->prepare('UPDATE rooms SET state_json = ?, version = version + 1 WHERE id = ? AND version = ?');
    $stmt->execute([json_encode($state, JSON_UNESCAPED_SLASHES), $room['id'], (int) $room['version']]);
    if ($stmt->rowCount() > 0) {
        break;
    }

    $room = find_room($code);
    if ($room === null) {
        json_response(['ok' => false, 'error' => 'Room not found.'], 404);
    }

    if ($attempt === 1) {
        json_response([
            'ok' => false,
            'error' => 'Room state changed. Try again.',
            'state' => json_decode((string) $room['state_json'], true),
            'status' => $room['status'],
            'version' => (int) $room['version'],
            'updatedAt' => $room['updated_at'],
        ], 409);
    }
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
