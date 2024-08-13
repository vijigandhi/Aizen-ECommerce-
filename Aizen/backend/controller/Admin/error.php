<?php
// Example error handling in router.php
$errorFilePath = __DIR__ . '/error.php';  // Adjust the path as necessary

if (file_exists($errorFilePath)) {
    require_once $errorFilePath;
} else {
    die('Error file not found: ' . $errorFilePath);
}
                                                                                                            