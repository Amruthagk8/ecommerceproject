import React, { useEffect, useState } from 'react';
import './AccountSettings.css';

export const AccountSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
       

        const response = await fetch('http://localhost:5000/api/v1/task/details', {
            method: 'GET', headers: {
              Accept: 'application/json',
              'auth-token': localStorage.getItem('auth-token'),
              'Content-type': 'application/json',
            },
            
        });

        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        if (data.success) {
            setFormData({
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone || '' // Assuming phone might not be available
            });
        } else {
            console.error('Error fetching user data:', data.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/task/update-details', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
  
      const data = await response.json();
      if (data.success) {
        alert('User data updated successfully:', data.message);
        // Optionally, you can update the state or redirect the user
      } else {
        console.error('Error updating user data:', data.message);
      }
    } catch (error) {
      console.error('Error updating user data:', error.message);
    }
  };

  return (
    <div className="account-settings">
      <h2>Personal Information</h2>
      <form onSubmit={handleSubmit} className="account-settings-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
