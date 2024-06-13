import React, { useState, useContext, useEffect } from 'react';
import './Checkout.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  const { allProducts, cartItems, getTotalCartAmount } = useContext(ShopContext);
  const productsInCart = allProducts.filter(product => cartItems[product.id] > 0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/get-addresses', {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        if (data.success) {
          setAddresses(data.address);
        } else {
          console.error('Failed to fetch addresses:', data.message);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/user/details', {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsername(data.user.username);
        } else {
          console.error('Failed to fetch user details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchAddresses();
    fetchUserDetails();
  }, []);

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    const selectedAddr = addresses.find(addr => addr._id === selectedId);
    setSelectedAddress(selectedAddr);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedAddress || !paymentMethod) {
      alert('Please select an address and a payment method.');
      return;
    }
  
    const orderDetails = {
      address: {
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
      },
      paymentMethod: paymentMethod,
      products: productsInCart.map(product => ({
        id: product.id,
        image: product.images[0],
        name: product.name,
        quantity: cartItems[product.id],
        price: product.new_price,
      })),
      totalAmount: getTotalCartAmount(),
    };
  
    try {
      console.log("Order details:", orderDetails);
      const response = await fetch('http://localhost:5000/api/v1/task/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify(orderDetails),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Order placed successfully!');
        navigate('/billing-details', { state: { orderDetails } });
      } else {
        alert('Failed to place order: ' + data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again later.');
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='checkout-container'>
      <h2>Checkout</h2>
      <form className='checkout-form' onSubmit={handleSubmit}>
        <div className='form-section'>
          <h3>Select Address</h3>
          {addresses.map((address, index) => (
            <div key={index} className="address-container">
              <label>
                <input
                  type='radio'
                  name='address'
                  value={address._id}
                  checked={selectedAddress && selectedAddress._id === address._id}
                  onChange={handleAddressChange}
                  required
                />
                <span style={{ fontFamily: 'Arial, sans-serif' }}>{`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}</span>
              </label>
            </div>
          ))}
        </div>

        <div className='form-section'>
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
              {productsInCart.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.images[0]} alt={product.name} className='product-image' />
                    <p>{product.name}</p>
                  </td>
                  <td>{cartItems[product.id]}</td>
                  <td>${(product.new_price * cartItems[product.id]).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className='total-price'>Total: ${getTotalCartAmount().toFixed(2)}</p>
        </div>

        <div className='form-section'>
          <h3>Payment Method</h3>
          <label>
            <input
              type='radio'
              name='payment'
              value='online'
              checked={paymentMethod === 'online'}
              onChange={handlePaymentChange}
              required
            />
            Online Payment
          </label>
          <label>
            <input
              type='radio'
              name='payment'
              value='cod'
              checked={paymentMethod === 'cod'}
              onChange={handlePaymentChange}
              required
            />
            Cash on Delivery
          </label>
        </div>

        <button type='submit' className='checkout-button'>Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
