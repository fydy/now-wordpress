<?php

$modules = file('php-modules.conf');
$ini = file_get_contents('php.ini');

$ini = preg_replace("/^extension.*\\n/m", "", $ini);

foreach($modules as $k => &$module) {
    $module = trim($module);
    if (empty($module)) {
        unset($modules[$k]);
    } else {
        $module = "extension=/root/app/modules/$module.so";
    }
}

file_put_contents('php.ini', implode(PHP_EOL, array_merge(
        $modules,
        [$ini]
)));
