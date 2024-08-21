<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins, adjust as needed
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Allow necessary methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow necessary headers

// Handle preflight request for OPTIONS method
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include "../model/Connection.php";
require '../vendor/autoload.php'; // Load PHPMailer using Composer's autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);

            // Debugging: Print the entire received data
            error_log('Received data: ' . print_r($data, true));

            if (!isset($data['cartItems'])) {
                echo json_encode(['status' => 'error', 'message' => 'Cart items are missing from the request.']);
                return;
            }

            // Extract and sanitize input data
            $shippingName = filter_var($data['shippingName'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $userId = filter_var($data['userId'] ?? '', FILTER_SANITIZE_NUMBER_INT);
            $total = filter_var($data['total'] ?? 0, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $houseDetail = filter_var($data['houseDetail'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $areaTown = filter_var($data['city'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $zipcode = filter_var($data['zipcode'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $phoneNo = filter_var($data['phoneNo'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $countryId = filter_var($data['Country'] ?? '', FILTER_SANITIZE_NUMBER_INT); // Expecting country ID
            $stateId = filter_var($data['stateSelect'] ?? '', FILTER_SANITIZE_NUMBER_INT); // Expecting state ID
            $paymentMethod = filter_var($data['paymentMethod'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $cartItems = $data['cartItems'] ?? [];

            // Debugging: Check the cart items structure
            error_log('Cart Items: ' . print_r($cartItems, true));

            $validPaymentMethods = ['cod']; // Add more valid methods if needed

            // Validate required fields
            if (empty($userId) || empty($shippingName) || empty($houseDetail) || empty($areaTown) || empty($zipcode) || empty($phoneNo) || empty($countryId) || empty($stateId)) {
                echo json_encode(['status' => 'error', 'message' => 'Required fields are missing.']);
                return;
            }

            if (!in_array($paymentMethod, $validPaymentMethods)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid payment method specified.']);
                return;
            }

            try {
                // Validate and Get Country
                $findCountry = $this->db->prepare("SELECT id FROM countries WHERE id = :id");
                $findCountry->execute(['id' => $countryId]);
                if (!$findCountry->fetch(PDO::FETCH_ASSOC)) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid country specified.']);
                    return;
                }

                // Validate and Get State
                $findState = $this->db->prepare("SELECT id FROM states WHERE id = :id AND country_id = :countryId");
                $findState->execute(['id' => $stateId, 'countryId' => $countryId]);
                if (!$findState->fetch(PDO::FETCH_ASSOC)) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid state specified or the state does not belong to the specified country.']);
                    return;
                }

                // Insert order
                $stmt = $this->db->prepare("INSERT INTO orders (shipping_name, user_id, total, payment_method, house_detail, area_town, zipcode, phone_no, country_id, state_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $success = $stmt->execute([$shippingName, $userId, $total, $paymentMethod, $houseDetail, $areaTown, $zipcode, $phoneNo, $countryId, $stateId]);

                if ($success) {
                    $orderId = $this->db->lastInsertId();
                    error_log("Order ID: $orderId");

                    // Check if cart items are provided
                    if (empty($cartItems)) {
                        echo json_encode(['status' => 'warning', 'message' => 'No items in the cart.']);
                        return;
                    }

                    // Update cart item quantities and insert order items
                    foreach ($cartItems as $item) {
                        // Debugging: Print each cart item
                        error_log('Processing cart item: ' . print_r($item, true));

                        // Extract cart item details
                        $cartItemId = filter_var($item['cart_item_id'] ?? null, FILTER_SANITIZE_NUMBER_INT);
                        $productId = filter_var($item['product_id'] ?? null, FILTER_SANITIZE_NUMBER_INT);
                        $quantity = filter_var($item['quantity'] ?? 0, FILTER_SANITIZE_NUMBER_INT);
                        $price = filter_var($item['selling_price'] ?? 0, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

                        if (!$cartItemId || !$quantity) {
                            error_log('Missing cart_item_id or quantity for cart item: ' . print_r($item, true));
                            echo json_encode(['status' => 'error', 'message' => 'Cart item ID or quantity is required.']);
                            return;
                        }

                        // Verify if product exists
                        $findProduct = $this->db->prepare("SELECT id FROM products WHERE id = :id");
                        $findProduct->execute(['id' => $productId]);
                        if (!$findProduct->fetch(PDO::FETCH_ASSOC)) {
                            error_log('Product ID not found: ' . $productId);
                            echo json_encode(['status' => 'error', 'message' => 'Invalid product ID: ' . $productId]);
                            return;
                        }

                        // Update cart item quantity
                        $updateCartItem = $this->db->prepare("UPDATE cart_item SET quantity = :quantity WHERE cart_item_id = :cart_item_id");
                        $updateCartItem->bindParam(':quantity', $quantity, PDO::PARAM_INT);
                        $updateCartItem->bindParam(':cart_item_id', $cartItemId, PDO::PARAM_INT);
                        $updateCartItem->execute();

                        // Insert order item
                        $stmt = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
                        $success = $stmt->execute([$orderId, $productId, $quantity, $price]);

                        if (!$success) {
                            error_log('Failed to process cart item: ' . implode(' ', $this->db->errorInfo()));
                            echo json_encode(['status' => 'error', 'message' => 'Failed to process cart item.']);
                            return;
                        }
                    }

                    // Remove cart items after successful order placement
                    $deleteCartItems = $this->db->prepare("DELETE FROM cart_item WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = ?)");
                    $deleteCartItems->execute([$userId]);

                    // Retrieve user email
                    $getUserEmail = $this->db->prepare("SELECT email FROM users WHERE id = :userId");
                    $getUserEmail->execute(['userId' => $userId]);
                    $user = $getUserEmail->fetch(PDO::FETCH_ASSOC);
                    
                    if ($user) {
                        $userEmail = $user['email'];
                        // Send confirmation email
                        $this->sendConfirmationEmail($shippingName, $userEmail, $total, $orderId);
                    } else {
                        error_log('User not found: ' . $userId);
                        echo json_encode(['status' => 'error', 'message' => 'User email not found.']);
                        return;
                    }

                    echo json_encode(['status' => 'success', 'message' => 'Order submitted successfully.']);
                } else {
                    error_log('Failed to submit order: ' . implode(' ', $this->db->errorInfo()));
                    echo json_encode(['status' => 'error', 'message' => 'Failed to submit order.']);
                }
            } catch (PDOException $e) {
                error_log('PDOException: ' . $e->getMessage());
                echo json_encode(['status' => 'error', 'message' => 'An error occurred while processing the order: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        }
    }

    private function sendConfirmationEmail($userName, $userEmail, $total, $orderId)
    {
        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Replace with your SMTP host
            $mail->SMTPAuth = true;
            $mail->Username = 'aizendckap@gmail.com'; // Replace with your SMTP username
            $mail->Password = 'nxwe euhq phcg zjsz'; // Replace with your SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            //Recipients
            $mail->setFrom('no-reply@example.com', 'Your Orders'); 
            $mail->addAddress($userEmail); // Use the customer's email

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Order Confirmation';
            $mail->Body = "
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background-color: #f9f9f9;
                    }
                    h1 {
                        color: #007BFF;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .highlight {
                        color: #007BFF;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>Order Confirmation</h1>
                    <p>Dear <span class='highlight'>$userName</span>,</p>
                    <p>Thank you for your order. Your order ID is <strong>$orderId</strong> and the total amount is <strong>\$$total</strong>.</p>
                    <p>If you have any questions, feel free to contact us.</p>
                    <div class='footer'>
                        <p>Best regards,</p>
                        <p>Aizen</p>
                    </div>
                </div>
            </body>
            </html>
            ";
            

            $mail->send();
            error_log('Confirmation email sent successfully.');
        } catch (Exception $e) {
            error_log("Error sending confirmation email: {$mail->ErrorInfo}");
        }
    }
}

$checkoutController = new CheckoutController();
$checkoutController->handleCheckout();
?>
