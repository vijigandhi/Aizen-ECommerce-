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

if ($userId === null) {
    echo json_encode(['error' => 'User ID is missing']);
    exit;
}

try {
    if ($method === 'GET') {
        // Fetch cart items for the authenticated user
        $stmt = $pdo->prepare("
            SELECT ci.*, p.name, p.selling_price, p.images
            FROM cart_item ci
            JOIN cart c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = :user_id
        ");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate total price
        $total = array_reduce($cartItems, function($carry, $item) {
            return $carry + ($item['selling_price'] * $item['quantity']);
        }, 0);

        echo json_encode([
            'cartItems' => $cartItems,
            'total' => number_format($total, 2),
            'userId' => $userId
        ]);
    } else {
        echo json_encode(['error' => 'Invalid request method']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>
