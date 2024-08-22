<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require '../controller/Admin/db_connect.php';

$state = $_GET['state'] ?? ''; // Get state from query parameter
$sql = "SELECT id, name FROM cities WHERE state_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $state);
$stmt->execute();
$result = $stmt->get_result();

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
