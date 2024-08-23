<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

$sql = "SELECT * FROM cities"; // Adjust query to match your table schema
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $cities = [];
    while($row = $result->fetch_assoc()) {
        $cities[] = $row;
    }
    echo json_encode($cities);
} else {
    echo json_encode([]);
}

$conn->close();
?>
