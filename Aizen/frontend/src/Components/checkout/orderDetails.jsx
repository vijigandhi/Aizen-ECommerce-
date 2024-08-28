import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';

const OrderDetails = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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
            } finally {
                setLoading(false);
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
            } catch (err) {
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [userId]);

    const groupByOrderId = (orders) => {
        return orders.reduce((acc, order) => {
            const { order_id } = order;
            if (!acc[order_id]) {
                acc[order_id] = {
                    order_id,
                    items: [],
                    shipping_name: order.shipping_name,
                    house_detail: order.house_detail,
                    area_town: order.area_town,
                    zipcode: order.zipcode,
                    payment_method: order.payment_method,
                    status: order.status,
                    created_at: order.created_at,
                    total_amount: order.total_amount,
                };
            }
            acc[order_id].items.push({
                product_name: order.product_name,
                product_image: order.product_image,
                price: order.price,
                quantity: order.quantity,
            });
            return acc;
        }, {});
    };

    const groupedOrders = Object.values(groupByOrderId(orderDetails));

    // Pagination Logic
    const paginate = (items, pageNumber, itemsPerPage) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(groupedOrders.length / itemsPerPage);

    return (
        <div>
            <Header />
            <section className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">

                <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Orders</h1>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="border-t-4 border-green-600 border-solid rounded-full w-16 h-16 animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading your orders...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {groupedOrders.length > 0 ? (
                            paginate(groupedOrders, currentPage, itemsPerPage).map((order) => (
                                <div key={order.order_id} className="bg-white shadow-lg rounded-lg border border-gray-300 p-6">
                                    <div className="mb-6 border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order ID: #{order.order_id}</h2>
                                        <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Shipping Name:</span> {order.shipping_name}</p>
                                        <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Address:</span> {order.house_detail}, {order.area_town}, {order.zipcode}</p>
                                        <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Payment Method:</span> {order.payment_method}</p>
                                        <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Status:</span> {order.status}</p>
                                        <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Created At:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Total Amount:</span> ₹{order.total_amount}</p>
                                    </div>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                                                <img
                                                    src={`http://localhost:8000/assets/images/${item.product_image}`}
                                                    alt={item.product_name}
                                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 mr-4"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/128';
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product_name}</h3>
                                                    <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Price:</span> ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No order details available.</p>
                        )}
                        {groupedOrders.length > itemsPerPage && (
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(1)}
                                    >
                                        First
                                    </button>
                                    <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(totalPages)}
                                    >
                                        Last
                                    </button>
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrderDetails;
