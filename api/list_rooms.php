<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$stmt = db()->query("SELECT * FROM rooms WHERE status = 'waiting' ORDER BY updated_at DESC LIMIT 30");
$rooms = [];

while ($room = $stmt->fetch()) {
    $tokens = room_player_tokens($room);
    $maxPlayers = room_max_players($room);
    if (count($tokens) >= $maxPlayers) {
        continue;
    }

    $state = json_decode((string) $room['state_json'], true);
    if (!is_array($state)) {
        continue;
    }

    $rooms[] = [
        'code' => (string) $room['code'],
        'name' => (string) ($state['roomName'] ?? ('Soba ' . $room['code'])),
        'playerCount' => count(is_array($state['players'] ?? null) ? $state['players'] : $tokens),
        'maxPlayers' => $maxPlayers,
        'updatedAt' => $room['updated_at'],
    ];
}

json_response([
    'ok' => true,
    'rooms' => $rooms,
]);
