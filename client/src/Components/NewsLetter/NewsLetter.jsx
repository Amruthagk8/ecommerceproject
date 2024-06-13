import React from 'react';
import './NewsLetter.css'

export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>get Exclusive Offers on Your Email</h1>
        <p>Subscribe To our newsletter and stay updated</p>
         <div>
            <input type="email" placeholder='Your EmailId' />
            <button>Subscribe</button>
         </div>
    
    
    </div>
  )
}
