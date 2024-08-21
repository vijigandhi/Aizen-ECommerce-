<?php
// Include database connection file
include 'db_connect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get action type and request ID from the POST request
    $action = $_POST['action'] ?? null;
    $requestId = intval($_POST['requestId'] ?? 0);

    if ($action && $requestId) {
        // Initialize a variable to hold the new status
        $newStatus = 0;
        $newUserRole = null;

        // Determine new status and user role based on the action
        if ($action === 'approve') {
            $newStatus = 1;
            $newUserRole = 2; // Assuming role ID 2 is for approved users
        } elseif ($action === 'reject') {
            $newStatus = 2;
        }

        // Prepare SQL statements for updating request status and user role
        $updateRequestSql = "UPDATE requests SET status = ? WHERE id = ?";
        $updateUserRoleSql = "UPDATE users SET role_id = ? WHERE id = (SELECT user_id FROM requests WHERE id = ?)";

        // Start a transaction
        mysqli_begin_transaction($conn);

        try {
            // Update request status
            $stmt = $conn->prepare($updateRequestSql);
            $stmt->bind_param('ii', $newStatus, $requestId);
            $stmt->execute();
            
            if ($newUserRole) {
                // Update user role if applicable
                $stmt = $conn->prepare($updateUserRoleSql);
                $stmt->bind_param('ii', $newUserRole, $requestId);
                $stmt->execute();
            }

            // Commit transaction
            mysqli_commit($conn);

            // Return success response
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            // Rollback transaction on error
            mysqli_rollback($conn);
            
            // Return error response
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }

        // Close the statement
        $stmt->close();
    } else {
        // Invalid request
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }

    // Close the database connection
    $conn->close();
} else {
    // Invalid request method
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
