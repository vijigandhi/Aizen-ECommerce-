<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST');


require 'db_connect.php';

$sql = "SELECT * FROM states";
$result = $conn->query($sql);
$states = [];

while ($row = $result->fetch_assoc()) {
    $states[] = $row;
}

echo json_encode($states);
$conn->close();
?>
