<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "../model/Connection.php";

// Enable detailed error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

class CheckoutController
{
    private $db;

    public function __construct()
    {
        $objDb = new DbConnect();
        $this->db = $objDb->connect();
    }

    public function handleCheckout()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);

            // Debugging: Log received data
            error_log('Received data: ' . print_r($data, true));

            $shippingName = $data['shippingName'] ?? null;
            $userId = $data['userId'] ?? null;
            $total = $data['total'] ?? null;
            $houseDetail = $data['houseDetail'] ?? null;
            $areaTown = $data['areaTown'] ?? null;
            $zipcode = $data['zipcode'] ?? null;
            $phoneNo = $data['phoneNo'] ?? null;
            $Country = $data['Country'] ?? null;
            $stateSelect = $data['stateSelect'] ?? null;
            $paymentMethod = $data['paymentMethod'] ?? null;
            $cartItems = $data['cartItems'] ?? [];
            

            if (empty($userId)  || empty($shippingName) || empty($houseDetail) || empty($areaTown) || empty($zipcode) || empty($phoneNo) || empty($Country) || empty($stateSelect)) {
                echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
                return;
            }

            try {
                // Get country ID
                $findCountry = $this->db->prepare("SELECT id FROM countries WHERE name = :name");
                $findCountry->execute(['name' => $Country]);
                $countryRow = $findCountry->fetch(PDO::FETCH_ASSOC);

                if (!$countryRow) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid country specified.']);
                    return;
                }
                $countryId = $countryRow['id'];

                // Get state ID
                $findState = $this->db->prepare("SELECT id FROM states WHERE name = :name");
                $findState->execute(['name' => $stateSelect]);
                $stateRow = $findState->fetch(PDO::FETCH_ASSOC);

                if (!$stateRow) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid state specified.']);
                    return;
                }
                $stateId = $stateRow['id'];

                // Insert order
                $stmt = $this->db->prepare("INSERT INTO orders (shipping_name,user_id,total,payment_method, house_detail, area_town, zipcode, phone_no, country_id, state_id) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)");
                $success = $stmt->execute([$shippingName, $userId,$total,$paymentMethod, $houseDetail, $areaTown, $zipcode, $phoneNo, $countryId, $stateId]);

                if ($success) {
                    $orderId = $this->db->lastInsertId(); // Get the last inserted order ID
                    error_log("Order ID: $orderId");

                    // Insert cart items
                    foreach ($cartItems as $item) {
                        $cartItemId = $item['cart_item_id'] ?? null;
                        $quantity = $item['quantity'] ?? 0;
                        $price = $item['special_price'] ?? 0;

                        // Validate cart_item_id
                        if (!$cartItemId) {
                            // Log error for debugging
                            error_log('Missing cart_item_id for cart item: ' . print_r($item, true));
                            echo json_encode(['status' => 'error', 'message' => 'Cart Item ID is required for cart items.']);
                            return;
                        }

                        // Insert or process the cart item
                        $stmt = $this->db->prepare("INSERT INTO order_details (order_id, cart_item_id, quantity, price) VALUES (?, ?, ?, ?)");
                        $success = $stmt->execute([$orderId, $cartItemId, $quantity, $price]);

                        if (!$success) {
                            // Log SQL error
                            error_log('Failed to process cart item: ' . implode(' ', $this->db->errorInfo()));
                            echo json_encode(['status' => 'error', 'message' => 'Failed to process cart item.']);
                            return;
                        }
                    }

                    echo json_encode(['status' => 'success', 'message' => 'Order submitted successfully.']);
                } else {
                    // Log SQL error
                    error_log('Failed to submit order: ' . implode(' ', $this->db->errorInfo()));
                    echo json_encode(['status' => 'error', 'message' => 'Failed to submit order.']);
                }
            } catch (PDOException $e) {
                // Log PDO exception
                error_log('PDOException: ' . $e->getMessage());
                echo json_encode(['status' => 'error', 'message' => 'An error occurred while processing the order.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        }
    }
}

$checkoutController = new CheckoutController();
$checkoutController->handleCheckout();
?>
