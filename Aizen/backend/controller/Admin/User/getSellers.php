<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST'); // Allow GET and POST methods

require '../db_connect.php'; // Include your database connection file

// SQL query to get users with role_id 2
$sql = "SELECT id, name, email FROM users WHERE role_id = 2";
$result = $conn->query($sql);
$sellers = [];

// Fetch the results into an array
while ($row = $result->fetch_assoc()) {
    $sellers[] = $row;
}

// Output data as JSON
echo json_encode($sellers);

$conn->close();
?>
