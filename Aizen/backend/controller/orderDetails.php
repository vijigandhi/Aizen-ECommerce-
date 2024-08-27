<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins, adjust as needed
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Allow necessary methods
header('Access-Control-Allow-Headers: Content-Type, Authorization');
include "../model/Connection.php"; // Include your DB connection file

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Get user ID from query parameters
$userId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Log the user ID to check if it's correctly retrieved
if ($userId <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid user ID received: ' . json_encode($_GET)
    ]);
    exit;
}

try {
    $db = new DbConnect();
    $pdo = $db->connect();

    // Fetch orders and shipping details for the user
    $stmt = $pdo->prepare("
    SELECT 
        o.id AS order_id,
        o.total AS total_amount,
        oi.product_id,
        oi.quantity,
        p.name AS product_name,
        p.images AS product_image,
        o.shipping_name,
        o.house_detail,
        o.area_town,
        o.zipcode,
        o.phone_no,
        o.payment_method,
        o.status
    FROM 
        orders o
    JOIN 
        order_items oi ON o.id = oi.order_id
    JOIN 
        products p ON oi.product_id = p.id
    WHERE 
        o.user_id = :userId
    ");

    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $orderDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($orderDetails) {
        $response = [
            'success' => true,
            'data' => $orderDetails
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'No orders found for this user'
        ];
    }
    
} catch (PDOException $e) {
    $response = [
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ];
}

echo json_encode($response);
?>