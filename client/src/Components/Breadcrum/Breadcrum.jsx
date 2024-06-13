import React from 'react';
import './Breadcrums.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';

export const Breadcrum = (props) => {
    const { product } = props;
    

    const category = product && product.category ? product.category : '';
    return (
        <div className='braedcrum'>
            HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {category} <img src={arrow_icon} alt="" /> {product && product.name}
        </div>
    );
};
