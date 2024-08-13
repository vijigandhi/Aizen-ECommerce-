<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
include '../db_connect.php'; // Ensure this file includes your database connection

// Get POST data
$store_id = isset($_POST['store_id']) ? (int)$_POST['store_id'] : 0;
$is_active = isset($_POST['is_active']) ? (int)$_POST['is_active'] : 0;

// Validate input
if ($store_id <= 0 || !in_array($is_active, [0, 1])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit();
}

// Update the store status
$sql = "UPDATE stores SET is_active = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ii', $is_active, $store_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Execute failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
