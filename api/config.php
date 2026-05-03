<?php
// Production secrets must live in api/config.local.php or environment variables.
// Do not commit real database passwords into this file.
define('DB_HOST', getenv('DB_HOST') ?: '');
define('DB_PORT', (int) (getenv('DB_PORT') ?: 3306));
define('DB_NAME', getenv('DB_NAME') ?: '');
define('DB_USER', getenv('DB_USER') ?: '');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');
