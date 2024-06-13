// App.js
import React from 'react';
import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Shop } from './Pages/Shop';
import { ShopCategory } from './Pages/ShopCategory';
import { Product } from './Pages/Product';
import { Cart } from './Pages/Cart';
import { LoginSignup } from './Pages/LoginSignup';
import { Footer } from './Components/Footer/Footer';
import ShopContextProvider from './Context/ShopContext';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import { Checkout } from './Components/Checkout/Checkout';
import { Placeorder } from './Components/PlaceOrder/Placeorder';
import { UserProfile } from './Pages/UserProfile';
import { AccountSettings } from './Components/AccountSettings/AccountSettings';
import { ChangePassword } from './Components/ChangePassword/ChangePassword';
import { Addresses } from './Components/Addresses/Addresses';
import { MyOrders } from './Components/MyOrders/MyOrders';
import BillingPage from './Components/BillingPage/BillingPage';
import OrderDetails from './Components/OrderDetails/OrderDetails';
import { ProductDisplay } from './Components/ProductDisplay/ProductDisplay';
import SearchResults from './Components/SearchResults/SearchResults'; // Import the SearchResults component
import Banner from './Components/Banner/Banner'


function App() {
  return (
    <ShopContextProvider>
      <BrowserRouter>
        <Navbar />
        <Banner/>
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category='men' />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category='women' />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category='kid' />} />
          <Route path='/product/:productId' element={<ProductDisplay />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/placeorder' element={<Placeorder />} />
          <Route path='/billing-details' element={<BillingPage />} />
          <Route path='/order-details/:orderId' element={<OrderDetails />} />
          <Route path='/searchresults' element={<SearchResults />} />
          <Route path='/profile' element={<UserProfile />}>
            <Route path='account-settings' element={<AccountSettings />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='addresses' element={<Addresses />} />
            <Route path='my-orders' element={<MyOrders />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </ShopContextProvider>
  );
}

export default App;
