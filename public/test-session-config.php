<?php
// Test if Session config is loading
require_once __DIR__ . '/../vendor/autoload.php';

$paths = new \Config\Paths();
$paths->systemDirectory = __DIR__ . '/../vendor/codeigniter4/framework/system';

define('ROOTPATH', realpath(__DIR__ . '/../') . DIRECTORY_SEPARATOR);
define('SYSTEMPATH', $paths->systemDirectory . DIRECTORY_SEPARATOR);
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
define('APPPATH', ROOTPATH . 'app' . DIRECTORY_SEPARATOR);
define('WRITEPATH', ROOTPATH . 'writable' . DIRECTORY_SEPARATOR);

// Try to load the Session config
try {
    $sessionConfig = config(\Config\Session::class);
    if ($sessionConfig) {
        echo "SUCCESS: Session config loaded!\n";
        echo "Driver: " . $sessionConfig->driver . "\n";
        echo "Cookie Name: " . $sessionConfig->cookieName . "\n";
        echo "Save Path: " . $sessionConfig->savePath . "\n";
    } else {
        echo "ERROR: Session config is null\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}


