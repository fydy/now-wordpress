<?php
if (!extension_loaded('mysqli')) {
    die("Mysqli extension not loaded!" . PHP_EOL);
}

if (!extension_loaded('dom')) {
    die("DOM extension not loaded!" . PHP_EOL);
}

if (!extension_loaded('gd')) {
    die("GD extension not loaded!" . PHP_EOL);
}


if (!class_exists("\\Phalcon\Version")) {
    die("Phalcon extension not loaded!" . PHP_EOL);
}

print('php_sapi_name=' . php_sapi_name() . PHP_EOL);
print('opcache_enabled=' . opcache_get_status()['opcache_enabled'] . PHP_EOL);
