import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import navlogo from '../../Assets/nav-logo.svg';
import navProfile from '../../Assets/nav-profile.svg';

export const Navbar = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth-token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('auth-token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setAuthToken(null);
    navigate('/');
  };

  return (
    <div className='navbar'>
      <img src={navlogo} alt="Logo" className="nav-logo" />
      <div className='nav-right'>
        {authToken ? (
          <>
            <img src={navProfile} alt="Profile" className='nav-profile' />
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to='/'><button>Login</button></Link>
        )}
      </div>
    </div>
  );
};
