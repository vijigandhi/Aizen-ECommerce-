<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);


if (!isset($data['name']) || !isset($data['address_line1']) || !isset($data['pincode']) || !isset($data['city_id']) || !isset($data['state_id']) || !isset($data['country_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$address_line1 = $conn->real_escape_string($data['address_line1']);
$address_line2 = $conn->real_escape_string($data['address_line2']);
$address_line3 = $conn->real_escape_string($data['address_line3']);
$pincode = $conn->real_escape_string($data['pincode']);
$city_id = intval($data['city_id']);
$state_id = intval($data['state_id']);
$country_id = intval($data['country_id']);

// SQL query to insert data into the stores table
$sql = "INSERT INTO stores (name, address_line1, address_line2, address_line3, pincode, city_id, state_id, country_id) 
        VALUES ('$name', '$address_line1', '$address_line2', '$address_line3', '$pincode', $city_id, $state_id, $country_id)";

try {
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Store added successfully']);
    } else {
        throw new mysqli_sql_exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
