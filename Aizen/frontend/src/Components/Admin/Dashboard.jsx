import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { BiBorderRadius } from 'react-icons/bi';

const Dashboard = () => {
  const [data, setData] = useState({
    labels: [],
    users: [],
    orders: [],
    total_records_processed: 0,
    records_processed_change: 0,
    success_rate: 0,
    success_rate_change: 0,
    new_customers: 0,
    new_customers_change: 0,
    new_orders: 0,
    new_orders_change: 0,
  });
  const [timePeriod, setTimePeriod] = useState('lifetime');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/Dashboard/getDashboard.php', {
          params: { period: timePeriod },
        });
        setData(prevData => ({
          ...prevData,
          total_records_processed: response.data.total_records_processed,
          records_processed_change: response.data.records_processed_change,
          success_rate: response.data.success_rate,
          success_rate_change: response.data.success_rate_change,
          new_customers: response.data.new_customers,
          new_customers_change: response.data.new_customers_change,
          new_orders: response.data.new_orders,
          new_orders_change: response.data.new_orders_change,
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/controller/Admin/Dashboard/getChart.php', {
          params: { period: timePeriod },
        });
        setData(prevData => ({
          ...prevData,
          labels: response.data.labels,
          users: response.data.users,
          orders: response.data.orders,
        }));
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchDashboardData();
    fetchChartData();
  }, [timePeriod]);

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  // Prepare data for the chart
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Customers',
        data: data.users,
        borderColor: '#4F46E5',
      
        fill: false,
      },
      {
        label: 'Orders',
        data: data.orders,
        borderColor: '#3B82F6',
        fill: false,
      },
    ],
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-5 gap-2 mb-6">
        <div className="bg-white p-6 rounded-sm">
          <h2 className="font-bold text-gray-600 text-sm mb-2">Time Period</h2>
          <select
            className="block w-full bg-white border border-gray-300 text-gray-600  focus:outline-none focus:ring-blue-500 "
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
          <h2 className="font-semibold text-gray-600 text-md mb-2">Total Products Processed</h2>
          <p className="text-2xl font-semibold text-green-900">{data.total_records_processed}</p>
          <p className="text-sm text-gray-600">
            {data.records_processed_change.toFixed(2)}% vs last 30 days
          </p>
        </div>

        <div className="bg-white p-4 rounded-sm">
          <h2 className="font-semibold text-gray-600 text-md mb-2">Sales </h2>
          <p className="text-2xl font-semibold text-green-900">{data.success_rate}</p>
          <p className="text-sm text-gray-600">
            {data.success_rate_change.toFixed(2)}% vs last 30 days
          </p>
        </div>

        <div className="bg-white p-4 rounded-sm">
          <h2 className="font-semibold text-gray-600 text-md mb-2">New Customers</h2>
          <p className="text-2xl font-semibold text-green-900">{data.new_customers}</p>
          <p className="text-sm text-gray-600">
            {data.new_customers_change.toFixed(2)}% vs last 30 days
          </p>
        </div>

        <div className="bg-white p-4 rounded-sm">
          <h2 className="font-semibold text-gray-600 text-md mb-2">New Orders</h2>
          <p className="text-2xl font-semibold text-green-900">{data.new_orders}</p>
          <p className="text-sm text-gray-600">
            {data.new_orders_change.toFixed(2)}% vs last 30 days
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm">
        <h2 className="font-semibold text-gray-600 text-md mb-4">Traffic- Custommers & Orders</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
