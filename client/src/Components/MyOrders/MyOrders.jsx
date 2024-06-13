import React, { useState, useEffect } from 'react';
import './MyOrders.css';
import { useNavigate } from 'react-router-dom';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/orders', {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error('Failed to fetch orders:', data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>
                <button onClick={() => handleViewDetails(order.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
