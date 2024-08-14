<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST');

require 'db_connect.php'; // Include your database connection file

$sql = "SELECT * FROM subcategories";
$result = $conn->query($sql);
$subcategories = [];

while ($row = $result->fetch_assoc()) {
    $subcategories[] = $row;
}

echo json_encode($subcategories);
$conn->close();
?>
