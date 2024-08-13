<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin:*'); // Replace with the domain of your frontend application
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

$requiredFields = ['user_id', 'name', 'email', 'mobile_no', 'address_line1', 'address_line2', 'address_line3'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required']);
        exit();
    }
}

require_once '../../vendor/autoload.php';
require_once '../../model/Connection.php';
$dbConnect = new DbConnect();
$conn = $dbConnect->connect();

$userId = $data['user_id'];
$name = $data['name'];
$email = $data['email'];
$mobileNo = $data['mobile_no'];
$addressLine1 = $data['address_line1'];
$addressLine2 = $data['address_line2'];
$addressLine3 = $data['address_line3'];

$query = "UPDATE users SET name=:name, email=:email, mobile_no=:mobile_no, address_line1=:address_line1, address_line2=:address_line2, address_line3=:address_line3 WHERE id=:user_id";
$stmt = $conn->prepare($query);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':mobile_no', $mobileNo);
$stmt->bindParam(':address_line1', $addressLine1);
$stmt->bindParam(':address_line2', $addressLine2);
$stmt->bindParam(':address_line3', $addressLine3);
$stmt->bindParam(':user_id', $userId);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update profile']);
}
?>
