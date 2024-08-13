<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include "../model/Connection.php";

try {
    $objDb = new DbConnect();
    $pdo = $objDb->connect();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
$productId = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;

if ($userId === null) {
    echo json_encode(['error' => 'User ID is missing']);
    exit;
}

try {
    if ($method === 'GET') {
        // Fetch count of cart items for the authenticated user
        $stmt = $pdo->prepare("
            SELECT COUNT(*) AS count
            FROM cart_item ci
            JOIN cart c ON ci.cart_id = c.id
            WHERE c.user_id = :user_id
        ");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['count' => $result['count']]);
    } 
    
    else {
        echo json_encode(['error' => 'Invalid request']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>
