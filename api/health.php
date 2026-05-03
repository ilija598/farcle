<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$checks = [
    'config' => file_exists(__DIR__ . '/config.php'),
    'db' => false,
    'rooms_table' => false,
    'columns' => [],
];

try {
    $pdo = db();
    $checks['db'] = true;

    $stmt = $pdo->query('SHOW COLUMNS FROM rooms');
    $columns = $stmt->fetchAll();
    $checks['rooms_table'] = true;
    $checks['columns'] = array_map(static fn($row) => $row['Field'], $columns);

    json_response(['ok' => true, 'checks' => $checks]);
} catch (Throwable $error) {
    json_response([
        'ok' => false,
        'checks' => $checks,
        'error' => $error->getMessage(),
    ], 500);
}

