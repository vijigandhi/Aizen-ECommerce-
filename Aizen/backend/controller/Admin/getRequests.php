<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST');

require './db_connect.php'; // Include your database connection file

$sql = "SELECT requests.id, users.name, requests.user_id, requests.request_details, requests.status, requests.created_at, requests.updated_at 
        FROM requests 
        INNER JOIN users ON requests.user_id = users.id 
        WHERE requests.status = 0";

$result = $conn->query($sql);
$requests = [];

while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}
echo json_encode($requests);
$conn->close();
?>

