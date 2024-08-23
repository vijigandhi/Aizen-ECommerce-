<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require '../db_connect.php';

// SQL query to select all details from the orders table
$sql = "SELECT * FROM orders";
$result = $conn->query($sql);

// Initialize an array to hold the order details
$orders = [];

// Fetch each row from the result set and add it to the array
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

// Output the array as a JSON object
echo json_encode($orders);

// Close the database connection
$conn->close();
?>
