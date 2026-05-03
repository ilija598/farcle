<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['ok' => false, 'error' => 'Invalid JSON body.'], 400);
    }

    return $data;
}

function require_config(): void
{
    $localConfigPath = __DIR__ . '/config.local.php';
    if (file_exists($localConfigPath)) {
        require_once $localConfigPath;
        return;
    }

    $configPath = __DIR__ . '/config.php';
    if (!file_exists($configPath)) {
        json_response(['ok' => false, 'error' => 'Missing api/config.local.php or environment database settings.'], 500);
    }

    require_once $configPath;

    $envMap = [
        'DB_HOST' => 'DB_HOST',
        'DB_PORT' => 'DB_PORT',
        'DB_NAME' => 'DB_NAME',
        'DB_USER' => 'DB_USER',
        'DB_PASS' => 'DB_PASS',
        'DB_CHARSET' => 'DB_CHARSET',
    ];
    foreach ($envMap as $constant => $envName) {
        $value = getenv($envName);
        if (!defined($constant) && $value !== false && $value !== '') {
            define($constant, $constant === 'DB_PORT' ? (int) $value : $value);
        }
    }

    foreach (['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_CHARSET'] as $constant) {
        if (!defined($constant) || (string) constant($constant) === '') {
            json_response(['ok' => false, 'error' => 'Database configuration is incomplete.'], 500);
        }
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    require_config();
    $port = defined('DB_PORT') ? ';port=' . DB_PORT : '';
    $dsn = 'mysql:host=' . DB_HOST . $port . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $error) {
        json_response(['ok' => false, 'error' => 'Database connection failed.'], 500);
    }

    return $pdo;
}

function random_token(int $bytes = 24): string
{
    return bin2hex(random_bytes($bytes));
}

function random_room_code(): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = '';
    for ($i = 0; $i < 5; $i += 1) {
        $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return $code;
}

function find_room(string $code): ?array
{
    $stmt = db()->prepare('SELECT * FROM rooms WHERE code = ? LIMIT 1');
    $stmt->execute([strtoupper(trim($code))]);
    $room = $stmt->fetch();
    return $room ?: null;
}

function token_player_index(array $room, string $token): ?int
{
    $tokens = room_player_tokens($room);
    foreach ($tokens as $index => $storedToken) {
        if ($storedToken !== '' && hash_equals($storedToken, $token)) {
            return $index;
        }
    }

    if (hash_equals((string) $room['player1_token'], $token)) {
        return 0;
    }
    if (!empty($room['player2_token']) && hash_equals((string) $room['player2_token'], $token)) {
        return 1;
    }
    return null;
}

function room_player_tokens(array $room): array
{
    $raw = (string) ($room['player_tokens_json'] ?? '');
    $tokens = $raw !== '' ? json_decode($raw, true) : null;
    if (is_array($tokens)) {
        return array_values(array_map('strval', $tokens));
    }

    $tokens = [(string) ($room['player1_token'] ?? '')];
    if (!empty($room['player2_token'])) {
        $tokens[] = (string) $room['player2_token'];
    }
    return array_values(array_filter($tokens, static fn(string $item): bool => $item !== ''));
}

function room_max_players(array $room): int
{
    $maxPlayers = (int) ($room['max_players'] ?? 2);
    return max(2, min(4, $maxPlayers));
}

function room_host_token(array $room): string
{
    return (string) (($room['host_token'] ?? '') ?: ($room['player1_token'] ?? ''));
}
