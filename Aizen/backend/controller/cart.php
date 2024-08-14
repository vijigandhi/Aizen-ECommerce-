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

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($user_id <= 0) {
        echo json_encode(['error' => 'Invalid user ID']);
        exit;
    }

    $query = 'SELECT ci.cart_item_id, p.id, p.images, p.name AS product_name, p.selling_price AS special_price, p.actual_price, ci.quantity
              FROM cart_item ci
              JOIN products p ON ci.product_id = p.id
              JOIN cart c ON ci.cart_id = c.id
              JOIN users u ON c.user_id = u.id
              WHERE u.id = :user_id';
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

    try {
        $stmt->execute();
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($cartItems)) {
            echo json_encode(['error' => 'No items found for user']);
        } else {
            echo json_encode($cartItems);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
    }
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['cart_item_id'], $input['quantity'], $input['action'])) {
        $cart_item_id = $input['cart_item_id'];
        $quantity = $input['quantity'];
        $action = $input['action'];

        if ($action === 'update_quantity' && $cart_item_id !== null && $quantity !== null) {
            try {
                // Fetch the cart item
                $stmt = $pdo->prepare("SELECT quantity, product_id FROM cart_item WHERE cart_item_id = :cart_item_id");
                $stmt->bindParam(':cart_item_id', $cart_item_id, PDO::PARAM_INT);
                $stmt->execute();
                $item = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($item) {
                    // Fetch available quantity from products table
                    $stmt = $pdo->prepare("SELECT quantity FROM products WHERE id = :product_id");
                    $stmt->bindParam(':product_id', $item['product_id'], PDO::PARAM_INT);
                    $stmt->execute();
                    $product = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($product) {
                        if ($quantity <= $product['quantity']) {
                            $stmt = $pdo->prepare("UPDATE cart_item SET quantity = :quantity WHERE cart_item_id = :cart_item_id");
                            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
                            $stmt->bindParam(':cart_item_id', $cart_item_id, PDO::PARAM_INT);
                            $stmt->execute();

                            echo json_encode(['success' => true, 'message' => 'Product quantity updated']);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Quantity exceeds available stock']);
                        }
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Product not found']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Cart item not found']);
                }
            } catch (PDOException $e) {
                echo json_encode(['error' => 'Update query failed: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid action or parameters']);
        }
    } elseif (isset($input['customer_id'], $input['product_id'], $input['quantity'], $input['price'], $input['strikeout_price'])) {
        $customer_id = $input['customer_id'];
        $product_id = $input['product_id'];
        $quantity = $input['quantity'];
        $price = $input['price'];
        $strikeout_price = $input['strikeout_price'];
        $total = $price * $quantity;

        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = :customer_id");
            $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
            $stmt->execute();
            $userExists = $stmt->fetchColumn();

            if ($userExists) {
                $stmt = $pdo->prepare("SELECT id FROM cart WHERE user_id = :customer_id");
                $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
                $stmt->execute();
                $cart_id = $stmt->fetchColumn();

                if (!$cart_id) {
                    $stmt = $pdo->prepare("INSERT INTO cart (user_id) VALUES (:customer_id)");
                    $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
                    $stmt->execute();
                    $cart_id = $pdo->lastInsertId();
                }

                $stmt = $pdo->prepare("SELECT quantity FROM cart_item WHERE cart_id = :cart_id AND product_id = :product_id");
                $stmt->bindParam(':cart_id', $cart_id, PDO::PARAM_INT);
                $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
                $stmt->execute();
                $existingQuantity = $stmt->fetchColumn();

                // Fetch available quantity from products table
                $stmt = $pdo->prepare("SELECT quantity FROM products WHERE id = :product_id");
                $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
                $stmt->execute();
                $product = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($product) {
                    if (($existingQuantity + $quantity) <= $product['quantity']) {
                        if ($existingQuantity !== false) {
                            $newQuantity = $existingQuantity + $quantity;
                            $stmt = $pdo->prepare("UPDATE cart_item SET quantity = :quantity, price = :price, strikeout_price = :strikeout_price, total = :total WHERE cart_id = :cart_id AND product_id = :product_id");
                            $stmt->bindParam(':quantity', $newQuantity, PDO::PARAM_INT);
                            $stmt->bindParam(':cart_id', $cart_id, PDO::PARAM_INT);
                            $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
                            $stmt->bindParam(':price', $price);
                            $stmt->bindParam(':strikeout_price', $strikeout_price);
                            $stmt->bindParam(':total', $total);
                            $stmt->execute();
                            echo json_encode(['success' => true, 'message' => 'Product quantity updated']);
                        } else {
                            $stmt = $pdo->prepare("INSERT INTO cart_item (cart_id, product_id, quantity, price, strikeout_price, total) VALUES (:cart_id, :product_id, :quantity, :price, :strikeout_price, :total)");
                            $stmt->bindParam(':cart_id', $cart_id, PDO::PARAM_INT);
                            $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
                            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
                            $stmt->bindParam(':price', $price);
                            $stmt->bindParam(':strikeout_price', $strikeout_price);
                            $stmt->bindParam(':total', $total);
                            $stmt->execute();
                            echo json_encode(['success' => true, 'message' => 'Product added to cart']);
                        }
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Quantity exceeds available stock']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Product not found']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => 'User or cart query failed: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    }
    exit;
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['cart_item_id'])) {
        $cart_item_id = $input['cart_item_id'];

        try {
            $stmt = $pdo->prepare("DELETE FROM cart_item WHERE cart_item_id = :cart_item_id");
            $stmt->bindParam(':cart_item_id', $cart_item_id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Cart item deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Cart item not found']);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Delete failed: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Missing cart_item_id']);
    }
    exit;
}
?>
