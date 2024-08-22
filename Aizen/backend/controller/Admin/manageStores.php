<?php
// Database connection
require_once '../../model/Connection.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate incoming data
    if (isset($data['store_id'], $data['is_active'], $data['is_popular'])) {
       
        $storeId = intval($data['store_id']);
        $isActive = intval($data['is_active']); // assuming 1 for active and 0 for inactive
        $isPopular = intval($data['is_popular']); // assuming 1 for popular and 0 for not popular

        // Prepare SQL query to update the store
        $query = "UPDATE stores SET is_active = :is_active, is_popular = :is_popular WHERE id = :store_id";
        
        try {
            // Database connection
            $database = new DbConnect();
            $db = $database->connect();

            // Prepare the statement
            $stmt = $db->prepare($query);
            
            // Bind parameters
            $stmt->bindParam(':is_active', $isActive);
            $stmt->bindParam(':is_popular', $isPopular);
            $stmt->bindParam(':store_id', $storeId);

            // Execute the query
            if ($stmt->execute()) {
                // Send a success response
                echo json_encode(['success' => true, 'message' => 'Store updated successfully']);
            } else {
                // Send a failure response
                echo json_encode(['success' => false, 'message' => 'Failed to update store']);
            }
        } catch (PDOException $e) {
            // Send an error response
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        // Missing data
        echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
