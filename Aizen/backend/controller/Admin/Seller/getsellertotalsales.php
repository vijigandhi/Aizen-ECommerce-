<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../vendor/autoload.php';
require_once '../../model/Connection.php';
require_once '../../utils/jwt.php';

$response = [];


$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

if (strpos($authHeader, 'Bearer ') === 0) {
    $token = str_replace('Bearer ', '', $authHeader);
    $key = '2dafac1e167d361ac1270103f471a562fb89207ffae675a20a2137ee1fd0359f'; // Your JWT secret key

    try {
        $decoded = decodeJWT($token, $key);

        if ($decoded) {

            $sellerId = $decoded['sub'];

            if (isset($_GET['seller_id']) && isset($_GET['start_date']) && isset($_GET['end_date'])) {
                $seller_id = $_GET['seller_id'];
                $start_date = $_GET['start_date'];
                $end_date = $_GET['end_date'];

                $conn = new DbConnect();
                $pdo = $conn->connect();

                $stmt = $pdo->prepare("
                    SELECT SUM(order_items.price * order_items.quantity) AS total_sales
                    FROM orders
                    JOIN order_items ON orders.id = order_items.order_id
                    JOIN products ON order_items.product_id = products.id
                    WHERE products.seller_id = :seller_id
                    AND orders.created_at BETWEEN :start_date AND :end_date
                ");
                $stmt->bindParam(':seller_id', $seller_id, PDO::PARAM_INT);
                $stmt->bindParam(':start_date', $start_date);
                $stmt->bindParam(':end_date', $end_date);
                $stmt->execute();

                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                $response['status'] = 'success';
                $response['total_sales'] = $result['total_sales'] ? (float)$result['total_sales'] : 0;

            } else {
                $response['status'] = 'error';
                $response['message'] = 'Missing required parameters';
            }

        } else {
            $response['status'] = 'error';
            $response['message'] = 'Invalid token';
        }
    } catch (Exception $e) {
        $response['status'] = 'error';
        $response['message'] = 'Token decoding failed: ' . $e->getMessage();
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Authorization header missing or malformed';
}

echo json_encode($response);
?>
