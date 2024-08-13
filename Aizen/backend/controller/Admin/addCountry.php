<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

// Read the input data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input data
if (!isset($data['name'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$categoryName = $conn->real_escape_string($data['name']);

// SQL query to insert data into the categories table
$sql = "INSERT INTO countries (name) VALUES ('$categoryName')";

try {
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Country added successfully']);
    } else {
        throw new mysqli_sql_exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
