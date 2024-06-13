import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FiPlusSquare, FiList, FiUsers, FiClipboard, FiImage } from 'react-icons/fi';

export const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to='/addproduct' style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <FiPlusSquare className='sidebar-icon' />
          <p>Add Product</p>
        </div>
      </Link>

      <Link to='/listproduct' style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <FiList className='sidebar-icon' />
          <p>Product List</p>
        </div>
      </Link>

      <Link to='/listusers' style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <FiUsers className='sidebar-icon' />
          <p>Users List</p>
        </div>
      </Link>

      <Link to='/listorders' style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <FiClipboard className='sidebar-icon' />
          <p>Orders List</p>
        </div>
      </Link>

      <Link to='/banner' style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <FiImage className='sidebar-icon' />
          <p>Banner</p>
        </div>
      </Link>
    </div>
  );
};
 