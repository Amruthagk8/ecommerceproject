import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import user_profile from '../Assets/user.png';
import search_icon from '../Assets/search.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

export const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/v1/task/search?query=${searchQuery}`);
      const data = await response.json();
      navigate('/searchresults', { state: { searchResults: data.products } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="Shop Logo" />
        <p>SHOPPER</p>
      </div>
      <div className='hamburger' onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <li onClick={() => { setMenu("shop"); setIsMenuOpen(false); }}>
          <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link> {menu === "shop" && <hr />}
        </li>
        <li onClick={() => { setMenu("mens"); setIsMenuOpen(false); }}>
          <Link style={{ textDecoration: 'none' }} to='/mens'>Men</Link> {menu === "mens" && <hr />}
        </li>
        <li onClick={() => { setMenu("womens"); setIsMenuOpen(false); }}>
          <Link style={{ textDecoration: 'none' }} to='/womens'>Women</Link> {menu === "womens" && <hr />}
        </li>
        <li onClick={() => { setMenu("kids"); setIsMenuOpen(false); }}>
          <Link style={{ textDecoration: 'none' }} to='/kids'>Kids</Link> {menu === "kids" && <hr />}
        </li>
      </ul>
      <div className='search-box'>
        <input
          type="text"
          name="search-form"
          id="search-form"
          className="search-input"
          onChange={handleSearchChange}
          placeholder="Search product...."
        />
        <img onClick={handleSearchSubmit} src={search_icon} alt="Search" />
      </div>
      <div className='nav-login-cart'>
        {localStorage.getItem('auth-token') ? (
          <>
            <Link to='/profile'> <img src={user_profile} alt="User Profile" className="user-profile-icon" /></Link>
            <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
          </>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
        <Link to='/cart'><img src={cart_icon} alt="Cart Icon" /></Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>

      
    </div>
  );
};
