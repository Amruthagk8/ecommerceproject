import React, { useEffect, useState } from 'react';
import './Banner.css';

const Banner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    console.log("start");
    fetch('http://localhost:5000/api/v1/task/fetchbanners')
      .then(response => response.json())
      .then(data => {
        console.log("data", data);
        if (data.success && Array.isArray(data.banners)) {
          setBanners(data.banners);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  return (
    <div>
      {banners.map(banner => (
        <div key={banner._id} className="hero">
          <div className="hero-left">
            <h2>Mega Offer</h2>
            <div>
              <p>Super Value</p>
              <p>Deals</p>
              <p>for everyone</p>
            </div>
            <div className="hero-latest-btn">
              <div>Offer Till Now: {banner.endDate}</div>
            </div>
          </div>
          <div className="hero-right">
            <img src={banner.image} alt={banner.description} />
            <p>{banner.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;
