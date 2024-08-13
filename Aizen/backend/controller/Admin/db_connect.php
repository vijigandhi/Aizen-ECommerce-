<?php
$servername = "localhost";
$username = "dckap";
$password = "Dckap2023Ecommerce";
$dbname = "Aizen";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
