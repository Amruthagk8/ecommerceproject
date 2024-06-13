import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './BillingPage.css';

const BillingPage = () => {
  const location = useLocation();
  const { orderDetails } = location.state;

  return (
    <div className='billing-details-container'>
      <h2>Billing Details</h2>
      <div className='billing-info'>
        <p><strong>Username:</strong> {orderDetails.username}</p>
        <p><strong>Address:</strong> {`${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zip}`}</p>
        <p><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</p>
      </div>
      <div className='order-details'>
        <h3>Order Details</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='total-price'>Total: ${orderDetails.totalAmount.toFixed(2)}</p>
      </div>
      <Link to='/' className='back-to-shop'>Back to Shop</Link>
    </div>
  );
};

export default BillingPage;
