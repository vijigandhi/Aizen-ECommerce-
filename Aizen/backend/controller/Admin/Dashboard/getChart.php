<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../db_connect.php';

// Get the time period filter from the request (e.g., 'last_30_days')
$time_period = $_GET['period'] ?? 'last_30_days';

// Define time range based on the selected period
$start_date = '';
$end_date = '';
switch ($time_period) {
    case 'lifetime':
        $start_date = '0000-01-01';
        $end_date = date('Y-m-d');
        break;
    case 'last_7_days':
        $start_date = date('Y-m-d', strtotime('-7 days'));
        $end_date = date('Y-m-d');
        break;
    case 'last_30_days':
        $start_date = date('Y-m-d', strtotime('-30 days'));
        $end_date = date('Y-m-d');
        break;
    case 'last_6_months':
        $start_date = date('Y-m-01', strtotime('-6 months'));
        $end_date = date('Y-m-d');
        break;
    case 'last_1_year':
        $start_date = date('Y-m-01', strtotime('-1 year'));
        $end_date = date('Y-m-d');
        break;
    default:
        $start_date = date('Y-m-d', strtotime('-30 days'));
        $end_date = date('Y-m-d');
        break;
}

// Query data grouped by month
$sql_users = "
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total_users
    FROM users
    WHERE created_at BETWEEN '$start_date' AND '$end_date'
    GROUP BY month
    ORDER BY month;
";

$sql_orders = "
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total_orders
    FROM orders
    WHERE created_at BETWEEN '$start_date' AND '$end_date'
    GROUP BY month
    ORDER BY month;
";

$users_result = $conn->query($sql_users);
$orders_result = $conn->query($sql_orders);

$data = [
    'labels' => [],
    'users' => [],
    'orders' => []
];

while ($row = $users_result->fetch_assoc()) {
    $data['labels'][] = $row['month'];
    $data['users'][] = (int)$row['total_users'];
}

while ($row = $orders_result->fetch_assoc()) {
    $data['orders'][] = (int)$row['total_orders'];
}

// Ensure that the labels array is consistent between users and orders
// Fill missing data for months that are present in one but not the other
$labels = array_unique(array_merge($data['labels'], $data['labels']));
$data['labels'] = array_values($labels);

foreach ($data['labels'] as $label) {
    if (!in_array($label, $data['labels'])) {
        $data['users'][] = 0;
        $data['orders'][] = 0;
    } else {
        $data['users'][] = $data['users'][array_search($label, $data['labels'])] ?? 0;
        $data['orders'][] = $data['orders'][array_search($label, $data['labels'])] ?? 0;
    }
}

echo json_encode($data);

$conn->close();
?>
