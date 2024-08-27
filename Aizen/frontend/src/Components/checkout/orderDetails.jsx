import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';

const OrderDetails = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/controller/Admin/getUserDetails.php', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    setUserId(response.data.user.id);
                } else {
                    setError('Please login to view your orders');
                }
            } catch (err) {
                setError('Error fetching user details');
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchOrderDetails = async () => {
            try {
                const orderResponse = await axios.get(`http://localhost:8000/controller/orderDetails.php?id=${userId}`);
                if (orderResponse.data.success) {
                    setOrderDetails(orderResponse.data.data);
                } else {
                    setError(orderResponse.data.message);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [userId]);



    return (
        <div>
            <Header />
            <section className="p-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Order Details</h1>
                {error && <p className="text-red-600 mb-4 text-lg">{error}</p>}
                {loading ? (
                    <p className="text-gray-600 mt-4 text-lg">Loading order details...</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {orderDetails.length > 0 ? (
                            orderDetails.map((order) => (
                                <div key={order.id} className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={`http://localhost:8000/assets/images/${order.product_image}`}
                                            alt={order.product_name}
                                            className="w-24 h-24 object-cover rounded-lg border border-gray-300 mr-4"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/128';
                                            }}
                                        />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">{order.product_name}</h2>
                                            <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                            <p className="text-sm text-gray-600">Total Amount: ₹{order.total_amount}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Shipping Name: {order.shipping_name}</p>
                                    <p className="text-sm text-gray-600">Address: {order.house_detail}, {order.area_town}, {order.zipcode}</p>
                                    <p className="text-sm text-gray-600">Payment Method: {order.payment_method}</p>
                                    <p className="text-sm text-gray-600">Status: {order.status}</p>

                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">No order details available.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrderDetails;
