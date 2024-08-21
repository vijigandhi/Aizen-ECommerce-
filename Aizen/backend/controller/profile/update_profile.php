<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Replace with the domain of your frontend application
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow methods
header('Access-Control-Allow-Headers: Authorization, Content-Type'); // Allow headers

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit();
}

// Check if user_id is provided
if (empty($data['user_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
    exit();
}

require_once '../../vendor/autoload.php';
require_once '../../model/Connection.php';
$dbConnect = new DbConnect();
$conn = $dbConnect->connect();

$userId = $data['user_id'];

// Prepare the query with only the fields that are provided
$updateFields = [];
$params = [];

// Only include fields that are provided and avoid overwriting other fields
if (isset($data['name'])) {
    $updateFields[] = 'name = :name';
    $params[':name'] = $data['name'];
}

if (isset($data['email'])) {
    $updateFields[] = 'email = :email';
    $params[':email'] = $data['email'];
}

if (isset($data['mobile_no'])) {
    $updateFields[] = 'mobile_no = :mobile_no';
    $params[':mobile_no'] = $data['mobile_no'];
}

if (isset($data['address_line1'])) {
    $updateFields[] = 'address_line1 = :address_line1';
    $params[':address_line1'] = $data['address_line1'];
}

if (isset($data['address_line2'])) {
    $updateFields[] = 'address_line2 = :address_line2';
    $params[':address_line2'] = $data['address_line2'];
}

if (isset($data['address_line3'])) {
    $updateFields[] = 'address_line3 = :address_line3';
    $params[':address_line3'] = $data['address_line3'];
}

// Ensure that only the provided fields are updated
if (empty($updateFields)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No fields to update']);
    exit();
}

// Build the query with only the fields that need updating
$query = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = :user_id";
$stmt = $conn->prepare($query);

// Bind parameters
foreach ($params as $param => $value) {
    $stmt->bindValue($param, $value);
}
$stmt->bindValue(':user_id', $userId);

// Execute the query
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update profile']);
}
?>
