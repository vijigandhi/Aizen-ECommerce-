<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require '../controller/Admin/db_connect.php';

$country = $_GET['country'] ?? ''; // Get country from query parameter
$sql = "SELECT id, name FROM states WHERE country_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $country);
$stmt->execute();
$result = $stmt->get_result();

$states = [];
while ($row = $result->fetch_assoc()) {
    $states[] = $row;
}

echo json_encode($states);
$conn->close();
?>
