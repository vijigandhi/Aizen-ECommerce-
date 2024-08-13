<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST'); // Allow GET and POST methods

require '../db_connect.php'; // Include your database connection file

// SQL query to get users with role_id 0
$sql = "SELECT id, name, email FROM users WHERE role_id = 3";
$result = $conn->query($sql);
$users = [];

// Fetch the results into an array
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

// Output data as JSON
echo json_encode($users);

$conn->close();
?>

