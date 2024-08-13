<?php

function generateSecretKey($length = 32) {
    // Generate random bytes
    $randomBytes = random_bytes($length);
    
    // Convert bytes to a hexadecimal representation
    return bin2hex($randomBytes);
}

// Generate a 256-bit (32-byte) key
$key = generateSecretKey(32);

// Output the generated key
echo "Your secret key: " . $key . "\n";
?>
