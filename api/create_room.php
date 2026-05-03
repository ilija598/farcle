<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$body = read_json_body();
$state = $body['state'] ?? null;
if (!is_array($state)) {
    json_response(['ok' => false, 'error' => 'Missing initial state.'], 400);
}

$maxPlayers = max(2, min(4, (int) ($body['maxPlayers'] ?? 2)));
$roomName = substr(trim(preg_replace('/\s+/', ' ', (string) ($body['roomName'] ?? ''))), 0, 28);
if ($roomName === '') {
    $roomName = 'Farcle soba';
}
$playerName = substr(trim(preg_replace('/\s+/', ' ', (string) ($body['playerName'] ?? ''))), 0, 18);
if ($playerName === '') {
    $playerName = 'Igrac 1';
}
$state['turnDeadlineAt'] = 0;
$state['turnStarted'] = true;
$state['maxPlayers'] = $maxPlayers;
$state['roomName'] = $roomName;
$state['players'] = [[
    'name' => $playerName,
    'score' => 0,
    'strikes' => 0,
    'timeoutStrikes' => 0,
    'aiControlled' => false,
]];
$state['savedDiceValues'] = [[]];
$state['chatMessages'] = [];

$token = random_token();
$pdo = db();

for ($attempt = 0; $attempt < 8; $attempt += 1) {
    $code = random_room_code();
    try {
        $stmt = $pdo->prepare('INSERT INTO rooms (code, state_json, player1_token, player_tokens_json, host_token, max_players, status, version) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $code,
            json_encode($state, JSON_UNESCAPED_SLASHES),
            $token,
            json_encode([$token], JSON_UNESCAPED_SLASHES),
            $token,
            $maxPlayers,
            'waiting',
            1,
        ]);
        json_response([
            'ok' => true,
            'code' => $code,
            'token' => $token,
            'playerIndex' => 0,
            'state' => $state,
            'status' => 'waiting',
            'version' => 1,
        ]);
    } catch (PDOException $error) {
        if ($error->getCode() !== '23000') {
            json_response([
                'ok' => false,
                'error' => 'Could not create room.',
                'dbError' => $error->getMessage(),
                'sqlState' => $error->getCode(),
            ], 500);
        }
    }
}

json_response(['ok' => false, 'error' => 'Could not generate room code.'], 500);
