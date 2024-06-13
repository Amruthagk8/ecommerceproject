// SearchResults.js
import React from 'react';
import '../Item/Item.css'; // Import Item.css for styles
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const SearchResults = () => {

    const handleScrollToTop = () => {
        window.scrollTo(0, 0);
      };
    
    const location = useLocation();
    const { searchResults } = location.state || { searchResults: [] };  
  return (
    <div className="search-results">
      {searchResults.map(product => (
        <div key={product._id} className="item"> {/* Use the "item" class */}
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
      ))}
    </div>
  );
};

export default SearchResults;
