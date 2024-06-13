import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/task/userorders/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log("data.orders", data.orders);
        setOrders(data.orders); // Access orders directly
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const updateProductStatus = async (orderId, productId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/v1/task/orders/${orderId}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                products: order.products.map((product) =>
                  product.id === productId ? { ...product, status: newStatus } : product
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <div className="user-orders">
      <h2>Orders for User {userId}</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) =>
            order.products.map((product) => (
              <tr key={product.id}>
                <td>{order.id}</td>
                <td><img src={product.image} alt={product.name} /></td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{order.paymentMethod}</td>
                <td>{`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zip}`}</td>
                <td>
                  {product.status === "This product will be cancelled" || product.status === "This product will return successfully" ? (
                    <span>{product.status}</span>
                  ) : (
                    <select
                      value={product.status}
                      onChange={(e) => updateProductStatus(order.id, product.id, e.target.value)}
                    >
                      <option value="Shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                      <option value="on the way">On the way</option>
                    </select>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrders;
