<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}

// Handle actual request
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow any origin
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require 'db_connect.php';

// SQL query to fetch roles
$sql = "SELECT id, name FROM roles"; // Adjust query to match your table schema

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $roles = [];
    while ($row = $result->fetch_assoc()) {
        $roles[] = $row;
    }
    echo json_encode($roles);
} else {
    echo json_encode([]);
}

$conn->close();
?>
