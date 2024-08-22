import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Function to fetch the logged-in user's ID
const fetchUserId = async () => {
  try {
    const response = await axios.get('http://localhost:8000/path/to/your/php/file.php', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your token storage
      }
    });
    if (response.data.status === 'success') {
      return response.data.user.id;
    } else {
      console.error('Failed to fetch user ID:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

const SellerDashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [timePeriod, setTimePeriod] = useState('lifetime');
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (sellerId !== null) {
        try {
          const startDate = getStartDate(timePeriod);
          const endDate = new Date().toISOString().split('T')[0];
          const response = await axios.get('http://localhost:8000/controller/Admin/Seller/getsellertotalsales.php', {
            params: { seller_id: sellerId, start_date: startDate, end_date: endDate },
          });
          setTotalSales(response.data.total_sales || 0);
        } catch (error) {
          console.error('Error fetching total sales:', error);
        }
      }
    };

    const fetchUserIdAndSales = async () => {
      const userId = await fetchUserId();
      setSellerId(userId);
    };

    fetchUserIdAndSales();
    fetchSalesData();
  }, [timePeriod, sellerId]);

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const getStartDate = (period) => {
    const today = new Date();
    switch (period) {
      case 'last_7_days':
        return new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
      case 'last_30_days':
        return new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
      case 'last_6_months':
        return new Date(today.setMonth(today.getMonth() - 6)).toISOString().split('T')[0];
      case 'last_1_year':
        return new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split('T')[0];
      case 'lifetime':
      default:
        return '1970-01-01'; // Start of Unix epoch
    }
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <div className="bg-white p-6 rounded-sm">
          <h2 className="font-bold text-gray-600 text-sm mb-2">Time Period</h2>
          <select
            className="block w-full bg-white border border-gray-300 text-gray-600 focus:outline-none focus:ring-blue-500"
            value={timePeriod}
            onChange={handleTimePeriodChange}
          >
            <option value="lifetime">Lifetime</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="last_1_year">Last 1 Year</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-sm">
          <h2 className="font-semibold text-gray-600 text-md mb-2">Total Sales</h2>
          <p className="text-2xl font-semibold text-green-900">${totalSales.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
