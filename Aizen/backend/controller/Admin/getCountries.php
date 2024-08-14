<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST');

// Include your database connection file
require 'db_connect.php'; // Adjust the path as needed

// Fetch countries
$sql = "SELECT * FROM countries"; // Adjust column names if necessary
$result = $conn->query($sql);

$countries = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $countries[] = $row;
    }
}

// Return the countries as JSON
echo json_encode(['countries' => $countries]);

// Close connection
$conn->close();
?>
