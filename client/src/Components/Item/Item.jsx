// Item.js
import React, { useState, useEffect } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

export const Item = (props) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/task/products/${props.id}`);
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
  }, [props.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!product || !product.available) {
    return null; // If product is not found or not available, don't display anything
  }

  return (
    <div className='item'>
      <Link to={`/product/${product._id}`}>
        <img onClick={handleScrollToTop} src={product.images[0]} alt={product.name} />
      </Link>
      <p>{product.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ${product.new_price}
        </div>
        {product.old_price && (
          <div className="item-price-old">
            ${product.old_price}
          </div>
        )}
      </div>
    </div>
  );
};
