import React, { useState, useCallback } from 'react';
import './ChangePassword.css';

// Debounce function to delay execution
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Debounced password verification function
  const verifyPassword = useCallback(
    debounce(async (password) => {
      if (password.length > 0) {
        try {
          console.log("password", password);
          const response = await fetch('http://localhost:5000/api/v1/task/verify-password', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('auth-token'),
            },
            body: JSON.stringify({ oldPassword: password }), // Replace 'USER_ID' with the actual user ID
          });

          const data = await response.json();
          console.log(data)
          if (!data.success) {
            setErrorMessage('Incorrect password');
          } else {
            setErrorMessage('');
          }
        } catch (error) {
          console.error('Error verifying password:', error);
          setErrorMessage('An unexpected error occurred.');
        }
      } else {
        setErrorMessage('');
      }
    }, 2000),
    []
  );

  const handleOldPasswordChange = (e) => {
    const password = e.target.value;
    setOldPassword(password);
    verifyPassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorMessage) {
      return; // Do not proceed if there's an error message
    }
    try {
      const response = await fetch('http://localhost:5000/api/v1/task/change-password', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
  
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Password changed successfully');
        // Clear input fields
        setOldPassword('');
        setNewPassword('');
      } else {
        setErrorMessage(data.message || 'Error changing password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };
  

  return (
    <div className="change-password-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={handleOldPasswordChange}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit">Save Changes</button>
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};
