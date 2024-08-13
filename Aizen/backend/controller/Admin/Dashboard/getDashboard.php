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
switch ($time_period) {
    case 'lifetime':
        $date_condition_current = "1"; // No date condition
        $date_condition_previous = "1"; // No date condition for previous period
        break;
    case 'last_7_days':
        $date_condition_current = "created_at >= NOW() - INTERVAL 7 DAY";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 14 DAY AND created_at < NOW() - INTERVAL 7 DAY";
        break;
    case 'last_30_days':
        $date_condition_current = "created_at >= NOW() - INTERVAL 30 DAY";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY";
        break;
    case 'last_6_months':
        $date_condition_current = "created_at >= NOW() - INTERVAL 6 MONTH";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 12 MONTH AND created_at < NOW() - INTERVAL 6 MONTH";
        break;
    case 'last_1_year':
        $date_condition_current = "created_at >= NOW() - INTERVAL 1 YEAR";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 2 YEAR AND created_at < NOW() - INTERVAL 1 YEAR";
        break;
    default:
        $date_condition_current = "created_at >= NOW() - INTERVAL 30 DAY";
        $date_condition_previous = "created_at >= NOW() - INTERVAL 60 DAY AND created_at < NOW() - INTERVAL 30 DAY";
        break;
}

// Helper function to calculate percentage change
function calculatePercentageChange($current, $previous) {
    if ($previous == 0) {
        return $current > 0 ? 100 : 0;
    }
    return (($current - $previous) / $previous) * 100;
}

// Total Records Processed
$sql_products_current = "SELECT COUNT(*) as total FROM products WHERE $date_condition_current";
$result_products_current = $conn->query($sql_products_current);
$total_records_processed_current = $result_products_current->fetch_assoc()['total'];

$sql_products_previous = "SELECT COUNT(*) as total FROM products WHERE $date_condition_previous";
$result_products_previous = $conn->query($sql_products_previous);
$total_records_processed_previous = $result_products_previous->fetch_assoc()['total'];

$records_processed_change = calculatePercentageChange($total_records_processed_current, $total_records_processed_previous);

// Success Rate (Sum of the total column from orders)
$sql_orders_sum_current = "SELECT SUM(total) as total_sum FROM orders WHERE $date_condition_current";
$result_orders_sum_current = $conn->query($sql_orders_sum_current);
$total_sum_current = $result_orders_sum_current->fetch_assoc()['total_sum'] ?? 0;

$sql_orders_sum_previous = "SELECT SUM(total) as total_sum FROM orders WHERE $date_condition_previous";
$result_orders_sum_previous = $conn->query($sql_orders_sum_previous);
$total_sum_previous = $result_orders_sum_previous->fetch_assoc()['total_sum'] ?? 0;

$success_rate_change = calculatePercentageChange($total_sum_current, $total_sum_previous);

// New Customers
$sql_customers_current = "SELECT COUNT(*) as total FROM users WHERE $date_condition_current";
$result_customers_current = $conn->query($sql_customers_current);
$new_customers_current = $result_customers_current->fetch_assoc()['total'];

$sql_customers_previous = "SELECT COUNT(*) as total FROM users WHERE $date_condition_previous";
$result_customers_previous = $conn->query($sql_customers_previous);
$new_customers_previous = $result_customers_previous->fetch_assoc()['total'];

$new_customers_change = calculatePercentageChange($new_customers_current, $new_customers_previous);

// New Orders
$sql_orders_count_current = "SELECT COUNT(*) as total FROM orders WHERE $date_condition_current";
$result_orders_count_current = $conn->query($sql_orders_count_current);
$new_orders_current = $result_orders_count_current->fetch_assoc()['total'];

$sql_orders_count_previous = "SELECT COUNT(*) as total FROM orders WHERE $date_condition_previous";
$result_orders_count_previous = $conn->query($sql_orders_count_previous);
$new_orders_previous = $result_orders_count_previous->fetch_assoc()['total'];

$new_orders_change = calculatePercentageChange($new_orders_current, $new_orders_previous);

// Prepare response
$response = [
    'total_records_processed' => $total_records_processed_current,
    'records_processed_change' => $records_processed_change,
    'success_rate' => $total_sum_current,
    'success_rate_change' => $success_rate_change,
    'new_customers' => $new_customers_current,
    'new_customers_change' => $new_customers_change,
    'new_orders' => $new_orders_current,
    'new_orders_change' => $new_orders_change
];

echo json_encode($response);

$conn->close();
?>
