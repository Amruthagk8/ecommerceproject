import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/allproducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const products = data.products;

        if (!Array.isArray(products)) {
          throw new Error('Products is not an array');
        }

        setAllProducts(products);

        // Initialize cart based on fetched products
        const initialCart = {};
        products.forEach(product => {
          initialCart[product.id] = 0;
        });
        setCartItems(initialCart);

        const authToken = localStorage.getItem('auth-token');
        setIsLoggedIn(!!authToken);  // Set login status based on auth-token

        if (authToken) {
          const cartResponse = await fetch('http://localhost:5000/api/v1/task/getcart', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'auth-token': authToken,
              'Content-Type': 'application/json'
            },
          });
          if (!cartResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const cartData = await cartResponse.json();

          if (cartData.success) {
            const userCartItems = cartData.cartData.reduce((acc, count, index) => {
              if (count > 0) {
                acc[index] = count; // Assuming cartData is an array where index represents the product ID minus 1
              }
              return acc;
            }, {});
            setCartItems(prevCartItems => ({
              ...prevCartItems,
              ...userCartItems
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch products or cart items:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem('auth-token')) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/addtocart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ itemId })
        });
        const data = await response.json();
        if (!data.success) {
          console.error('Failed to add item to cart:', data.message);
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 0) {
        newCart[itemId] -= 1;
      }
      return newCart;
    });
   
    if (localStorage.getItem('auth-token')) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/decrementcart', {  // Adjust endpoint for decrementing
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId })
        });
        const data = await response.json();
        if (!data.success) {
          console.error('Failed to decrement item from cart:', data.message);
        }
      } catch (error) {
        console.error('Error decrementing item from cart:', error);
      }
    }
  };

  const removeItemCompletely = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      newCart[itemId] = 0;
      return newCart;
    });
  
    if (localStorage.getItem('auth-token')) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/removefromcart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId }),
        });
        const data = await response.json();
        if (data.success) {
          setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[itemId]; // Ensure the item is completely removed
            return newCart;
          });
        } else {
          console.error('Failed to remove item from cart:', data.message);
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };
  
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = allProducts.find((product) => product.id === Number(item));
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    removeItemCompletely,
    getTotalCartItems,
    getTotalCartAmount,
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    isLoggedIn, // Provide isLoggedIn in the context
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
