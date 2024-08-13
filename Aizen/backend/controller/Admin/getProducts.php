<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST');

require './db_connect.php'; // Include your database connection file

// Check if store_id is provided in the query parameters
if (isset($_GET['store_id'])) {
    $storeId = intval($_GET['store_id']); // Get the store ID from the query parameter and ensure it's an integer

    // Prepare the SQL query to fetch products for the given store_id
    $stmt = $conn->prepare("SELECT id, name, quantity FROM products WHERE store_id = ?");
    $stmt->bind_param('i', $storeId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $products = [];

    // Fetch all the products and store them in an array
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    // Return the products as a JSON response
    echo json_encode(['products' => $products]);
    
    $stmt->close();
} else {
    // If store_id is not provided, return an error message
    echo json_encode(['error' => 'Store ID is required']);
}

$conn->close();
?>
