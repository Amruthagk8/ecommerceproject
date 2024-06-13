import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ShopContextProvider from './Context/ShopContext.jsx'
import { Breadcrum } from './Components/Breadcrum/Breadcrum.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShopContextProvider>
    <App />
    

    </ShopContextProvider>
   
  </React.StrictMode>,
)
