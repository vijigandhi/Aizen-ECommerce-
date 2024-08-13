<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

// Get the input data
$data = json_decode(file_get_contents('php://input'), true);
$cityName = $conn->real_escape_string($data['name']);
$country_id = (int)$data['country_id'];

// Check if the state exists
$checkSql = "SELECT id FROM countries WHERE id = $country_id";
$checkResult = $conn->query($checkSql);

if ($checkResult->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid state ID']);
    exit;
}

// Insert query
$sql = "INSERT INTO states (name, country_id) VALUES ('$cityName', '$country_id')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'City added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}

$conn->close();
?>
