<?php
// Include database connection file
include './db_connect.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the order ID and status from the POST request
    $orderId = intval($_POST['order_id'] ?? 0);
    $newStatus = trim($_POST['status'] ?? '');

    // Debugging output
    error_log("Received order_id: " . $orderId);
    error_log("Received status: " . $newStatus);

    if ($orderId > 0 && !empty($newStatus)) {
        // Prepare SQL statement for updating order status
        $updateOrderSql = "UPDATE orders SET Status = ? WHERE id = ?";

        // Start a transaction
        mysqli_begin_transaction($conn);

        try {
            // Prepare and execute the statement
            $stmt = $conn->prepare($updateOrderSql);
            if (!$stmt) {
                throw new Exception('Prepare failed: ' . $conn->error);
            }
            $stmt->bind_param('si', $newStatus, $orderId);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                // Commit transaction
                mysqli_commit($conn);
                // Return success response
                echo json_encode(['success' => true, 'message' => 'Order status updated successfully.']);
            } else {
                // No rows updated
                throw new Exception('No rows updated. Check if the order ID exists.');
            }
        } catch (Exception $e) {
            // Rollback transaction on error
            mysqli_rollback($conn);
            // Return error response
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }

        // Close the statement
        $stmt->close();
    } else {
        // Invalid request
        echo json_encode(['success' => false, 'message' => 'Invalid order ID or status.']);
    }

    // Close the database connection
    $conn->close();
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>

