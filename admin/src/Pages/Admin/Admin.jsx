import React from 'react';
import './Admin.css';
import { Sidebar } from '../../Components/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import { Addproduct } from '../../Components/AddProduct/Addproduct';
import { Listproduct } from '../../Components/ListProduct/Listproduct';
import { ListUsers } from '../../Components/ListUsers/ListUsers';
import ListOrders from '../../Components/ListOrders/ListOrders';
import UserOrders from '../../Components/UserOrders/UserOrders';
import { DashBoard } from '../../Components/DashBoard/DashBoard';
import { LoginForm } from '../../Components/LoginForm/LoginForm';
import ProtectedRoute from '../../Components/ProtectedRoute/ProtectedRoute';
import { Banner } from '../../Components/Banner/Banner';


export const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<ProtectedRoute element={DashBoard} />} />
        <Route path="/addproduct" element={<ProtectedRoute element={Addproduct} />} />
        <Route path="/listproduct" element={<ProtectedRoute element={Listproduct} />} />
        <Route path="/listusers" element={<ProtectedRoute element={ListUsers} />} />
        <Route path="/listorders" element={<ProtectedRoute element={ListOrders} />} />
        <Route path="/userorders/:userId" element={<ProtectedRoute element={UserOrders} />} />
        <Route path='/banner' element={<ProtectedRoute element={Banner}/>}/>
      </Routes>
    </div>
  );
};
