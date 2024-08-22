<?php
require_once '../db_connect.php'; // Ensure this file contains your database connection code

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$response = array('success' => false, 'products' => array());

if (isset($_GET['user_id'])) {
    $userId = intval($_GET['user_id']); // Sanitize user ID to prevent SQL injection

    // Prepare the SQL query to get products for the specific user
    $query = "SELECT * FROM products WHERE seller_id = ?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("i", $userId); // Bind the user ID parameter
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $products = array();
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            $response['success'] = true;
            $response['products'] = $products;
        } else {
            $response['message'] = 'No products found for this user.';
        }

        $stmt->close();
    } else {
        $response['message'] = 'Failed to prepare SQL statement.';
    }
} else {
    $response['message'] = 'User ID is required.';
}

$conn->close();
echo json_encode($response);
?>

