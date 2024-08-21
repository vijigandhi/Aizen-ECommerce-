<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['userId']) || !isset($data['items'])) {
        echo json_encode(['error' => 'Missing parameters']);
        exit;
    }

    $userId = (int)$data['userId'];
    $items = $data['items'];

    try {
        foreach ($items as $item) {
            $cartItemId = filter_var($item['cart_item_id'] ?? null, FILTER_SANITIZE_NUMBER_INT);
            $quantity = filter_var($item['quantity'] ?? 0, FILTER_SANITIZE_NUMBER_INT);
        
            if (!$cartItemId || !$quantity) {
                echo json_encode(['error' => 'Missing cart item ID or quantity']);
                exit;
            }
        
            $stmt = $pdo->prepare("
                UPDATE cart_item
                SET quantity = :quantity
                WHERE cart_item_id = :cart_item_id
            ");
            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
            $stmt->bindParam(':cart_item_id', $cartItemId, PDO::PARAM_INT);
            $stmt->execute();
        }
        
        echo json_encode(['success' => true, 'message' => 'Quantities updated successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
