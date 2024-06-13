import React from 'react';
import './UserSidebar.css';
import { Link } from 'react-router-dom';

export const UserSidebar = () => {
  return (
    <div className="user-sidebar">
      <h2>User Menu</h2>
      <ul>
        <li>
          <Link to="account-settings">
            <i className="fas fa-cog icon"></i>
            Account Settings
          </Link>
        </li>
        <li>
          <Link to="change-password">
            <i className="fas fa-key icon"></i>
            Change Password
          </Link>
        </li>
        <li>
          <Link to="addresses">
            <i className="fas fa-address-book icon"></i>
            Addresses
          </Link>
        </li>
        <li>
          <Link to="my-orders">
            <i className="fas fa-shopping-cart icon"></i>
            My Orders
          </Link>
        </li>
      </ul>
    </div>
  );
};
