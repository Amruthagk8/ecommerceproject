import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/task/orders/${orderId}`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        console.log("data", data);
        if (data.success) {
          const order = data.order.find(order => order.id === parseInt(orderId));
          if (order) {
            setOrder(order);
          } else {
            console.error('Order not found');
          }
        } else {
          console.error('Failed to fetch order details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCancel = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/task/cancel-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ orderId, productId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Order cancelled successfully');
        navigate('/profile/my-orders'); // Redirect to the orders page
      } else {
        alert('Failed to cancel order: ' + data.message);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order. Please try again later.');
    }
  };

  const handleReturn = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/task/return-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ orderId, productId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Product returned successfully');
        setOrder((prevOrder) => {
          const updatedProducts = prevOrder.products.map(product => {
            if (product.id === productId) {
              return { ...product, status: 'This product will return successfully' };
            }
            return product;
          });
          return { ...prevOrder, products: updatedProducts };
        });
      } else {
        alert('Failed to return product: ' + data.message);
      }
    } catch (error) {
      console.error('Error returning product:', error);
      alert('Error returning product. Please try again later.');
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  const canReturn = (orderDate) => {
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // one week in milliseconds
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    return now - orderTime <= oneWeek;
  };

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <div>Order ID: {order.id}</div>
      <div>Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
      <div>Total Price: ${order.totalAmount.toFixed(2)}</div>
      <h3>Products</h3>
      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map(product => (
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} /></td>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td style={{ color: product.status === 'delivered' ? 'green' : product.status === 'on the way' ? 'red' : 'black' }}>
                {product.status}
              </td>
              <td>
                {product.status === 'This product will return successfully' || product.status === 'This product will be cancelled' ? null : (
                  <>
                    {product.status === 'delivered' && canReturn(order.orderDate) ? (
                      <button className="action-button return-button" onClick={() => handleReturn(product.id)}>Return</button>
                    ) : product.status !== 'delivered' ? (
                      <button className="action-button cancel-button" onClick={() => handleCancel(product.id)}>Cancel</button>
                    ) : null}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
