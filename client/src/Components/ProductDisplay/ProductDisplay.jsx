import React, { useState, useEffect, useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { useParams, useNavigate } from 'react-router-dom';

export const ProductDisplay = () => {
  const { productId } = useParams();
  const { addToCart, isLoggedIn } = useContext(ShopContext);
  const navigate = useNavigate();
console.log("productId:",productId)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("start",productId)
        const response = await fetch(`http://localhost:5000/api/v1/task/productdetails/${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setProduct(data.data[0]);
        } else {
          throw new Error('Product not found');
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (isLoggedIn) {
      addToCart(product.id);
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    return null; // If product is not found, don't display anything
  }

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.images[1]} alt="" />
          <img src={product.images[2]} alt="" />
          <img src={product.images[3]} alt="" />
          <img src={product.images[4]} alt="" />
        </div>
        <div>
          <div className="productdisplay-img">
            <img className='productdisplay-main-img' src={product.images[0]} alt="" />
          </div>
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-rightprice-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Fashioned from a breathable cotton blend material, this shirt set can be worn for long periods without feeling uncomfortable. Ideal for warm, hot climates, this shirt keeps you stay cool and comfortable.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button onClick={handleAddToCart}>ADD TO CART</button>
        <p className='productdisplay-right-category'><span>Category :</span> Women, T-shirt, Crop Top</p>
        <p className='productdisplay-right-category'><span>Tags :</span> Modern, Latest</p>
      </div>
    </div>
  );
};
