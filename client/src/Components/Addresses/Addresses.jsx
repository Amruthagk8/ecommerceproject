import React, { useState, useEffect } from 'react';
import './Addresses.css';

export const Addresses = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]); // Assuming initial addresses are retrieved from backend
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  // Function to handle adding a new address (backend call)
  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      console.log('started');
      const response = await fetch('http://localhost:5000/api/v1/task/add-address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();

      if (data.success) {
        setAddresses([...addresses, data.address]); // Update state with new address
        setNewAddress({ street: '', city: '', state: '', zip: '' }); // Reset new address form
        setIsAddingAddress(false);
      } else {
        // Handle errors (e.g., validation failure, server error)
        alert('Error adding address:', data.error);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('An unexpected error occurred.');
    }
  };

  // Function to handle changes in the address form
  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  // Function to handle deleting an address
  const handleDeleteAddress = (index) => {
    console.log("index", index);
    
    // Implement logic to delete address from backend
    fetch(`http://localhost:5000/api/v1/task/delete-address/${index}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const updatedAddresses = [...addresses];
        updatedAddresses.splice(index, 1);
        setAddresses(updatedAddresses);
      } else {
        alert('Error deleting address:', data.error);
      }
    })
    .catch((error) => {
      console.error('Error deleting address:', error);
    });
  };
  
  const fetchAddresses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/task/get-addresses', {
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
      });

      const data = await response.json();
      console.log("address", data)
      if (data.success) {
        console.log("address", data.address)
        setAddresses(data.address); // Update state with fetched addresses
      } else {
        // Handle errors (e.g., failed to fetch addresses)
        alert('Error fetching addresses:', data.error);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      alert('An unexpected error occurred.');
    }
  };

  // Fetch addresses on component mount using useEffect
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Function to render the list of user addresses
  const renderAddressList = () => {
    return addresses.map((address, index) => (
      <div key={index} className="address-item">
        <div className="address-details">
          <p>{address.street}</p>
          <p>{address.city}, {address.state} {address.zip} </p>
        </div>
        <button className="delete-button" onClick={() => handleDeleteAddress(index)}>
          Delete
        </button>
      </div>
    ));
  };
  
  // Function to render the address form
  const renderAddAddressForm = () => (
    <form onSubmit={handleAddAddress}>
      <div className="form-group">
        <label htmlFor="street">Street:</label>
        <input
          type="text"
          id="street"
          name="street"
          value={newAddress.street}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={newAddress.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          name="state"
          value={newAddress.state}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="zip">Zip Code:</label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={newAddress.zip}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Address</button>
    </form>
  );

  return (
    <div className="addresses-container">
      <h2>Your Addresses</h2>
      {renderAddressList()}
      <button className="add-address-button" onClick={() => setIsAddingAddress(!isAddingAddress)}>
        <span className="icon">➕</span>
        {isAddingAddress ? 'Close Form' : 'Add Address'}
      </button>
      {isAddingAddress && renderAddAddressForm()}
    </div>
  );
};
