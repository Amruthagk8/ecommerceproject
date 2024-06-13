import React, { useEffect, useState } from 'react';
import './Popular.css';
import { Item } from '../Item/Item';

export const Popular = () => {
  const [popularinwomen, setPopularInWomen] = useState([]);

  useEffect(() => {
    const fetchPopularInWomen = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/popularinwomen');
        const data = await response.json();
console.log("popular women ",data)
        // Check if the response contains the products array
        if (data && data.success && Array.isArray(data.products)) {
          setPopularInWomen(data.products);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch popular in women:", error);
      }
    };

    fetchPopularInWomen();
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className='popular-item'>
        {popularinwomen.map((item, i) => (
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        ))}
      </div>
    </div>
  );
};
