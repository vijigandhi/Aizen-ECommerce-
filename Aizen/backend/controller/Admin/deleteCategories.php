<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
include 'db_connect.php';

// Check if the category ID is provided via GET request
if (isset($_GET['id'])) {
    $categoryId = $_GET['id'];

    // Prepare the SQL statement to delete the category
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param("i", $categoryId);

    // Execute the statement
    if ($stmt->execute()) {
        // If the deletion was successful
        echo json_encode(['success' => true, 'message' => 'Category deleted successfully.']);
    } else {
        // If there was an error during deletion
        echo json_encode(['success' => false, 'message' => 'Failed to delete category.']);
    }

    // Close the statement
    $stmt->close();
} else {
    // If the category ID was not provided
    echo json_encode(['success' => false, 'message' => 'No category ID provided.']);
}

// Close the database connection
$conn->close();
?>
