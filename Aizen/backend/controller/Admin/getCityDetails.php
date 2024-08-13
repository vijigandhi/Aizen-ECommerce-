<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

$city_id = intval($_GET['city_id'] ?? 0);

if ($city_id === 0) {
    echo json_encode(['error' => 'Invalid city ID']);
    exit;
}

$sql = "SELECT cities.state_id, states.country_id 
        FROM cities 
        JOIN states ON cities.state_id = states.id 
        WHERE cities.id = $city_id";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'City not found']);
}

$conn->close();
?>
