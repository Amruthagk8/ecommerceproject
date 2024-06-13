import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { Link } from 'react-router-dom';

export const CartItems = () => {
  const { getTotalCartAmount, allProducts, cartItems, addToCart, removeFromCart, removeItemCompletely } = useContext(ShopContext);

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {allProducts.map((product) => {
        if (cartItems[product.id] > 0) {
          return (
            <div key={product.id} className="cartitems-format cartitems-format-main">
              <img src={product.images[0]} className='carticon-product-icon' alt="" />
              <p>{product.name}</p>
              <p>${product.new_price}</p>
              <div className='cartitems-quantity'>
                <button onClick={() => removeFromCart(product.id)} className='cartitems-quantity-button'>-</button>
                <span>{cartItems[product.id]}</span>
                <button onClick={() => addToCart(product.id)} className='cartitems-quantity-button'>+</button>
              </div>
              <p>${product.new_price * cartItems[product.id]}</p>
              <img className='cartitems-remove-icon' src={remove_icon} onClick={() => removeItemCompletely(product.id)} alt="Remove" />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <h3>Total</h3>
            <h3>${getTotalCartAmount()}</h3>
          </div>
          <Link to='/checkout'><button>PROCEED TO CHECKOUT</button></Link>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promocode, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='Promocode' name="" id="" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
