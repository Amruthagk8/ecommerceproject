import React from 'react';
import './DiscriptionBox.css';

export const DiscriptionBox = () => {
  return (
    <div className='description-box'>
      <div className="description-box-navigator">
        <div className="description-box-nav-box">
          Description
        </div>
        <div className="description-box-nav-box fade">
          Reviews (122)
        </div>
      </div>
      <div className="description-box-description">
        <p>
          Embark on your next journey with confidence, equipped with our All-Day Adventure Backpack. Crafted with the modern traveler in mind, this versatile backpack seamlessly blends functionality with style.

          Featuring a durable yet lightweight construction, this backpack is designed to withstand the rigors of daily use while ensuring all-day comfort. The spacious main compartment offers ample storage for your essentials, whether you're heading to the office, hitting the gym, or exploring the great outdoors.

          Organization is made easy with multiple compartments and pockets, allowing you to keep your belongings neatly arranged and easily accessible. A padded laptop sleeve provides secure storage for your tech essentials, while side pockets are perfect for keeping water bottles or umbrellas within reach.
        </p>
      </div>
    </div>
  );
};
