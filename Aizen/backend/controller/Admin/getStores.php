<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST');

require './db_connect.php'; // Include your database connection file

$sql = "SELECT * FROM stores";
$result = $conn->query($sql);
$stores = [];

while ($row = $result->fetch_assoc()) {
    $stores[] = $row;
}
echo json_encode($stores);
$conn->close();
?>
