import React, { useEffect, useState } from 'react';
import { UserSidebar } from '../Components/UserSidebar.jsx/UserSidebar';
import './CSS/UserProfile.css';
import { Outlet } from 'react-router-dom';

export const UserProfile = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("start");
                const response = await fetch('http://localhost:5000/api/v1/task/details', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': localStorage.getItem('auth-token'),
                        'Content-type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }

                const data = await response.json();
                console.log("username:", data);
                if (data.success && data.user) {
                    setUsername(data.user.name);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="user-profile">
            <UserSidebar />
            <div className="user-content">
                <div className="welcome-message">
                    <h1>Welcome to Your Profile, {username}!</h1>
                    <p>Manage your personal information, check your orders, manage your addresses, and update your settings here.</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};
