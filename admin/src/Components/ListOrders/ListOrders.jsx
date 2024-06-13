import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListOrders.css';

const ListOrders = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/users');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  const viewOrders = (userId) => {
    navigate(`/userorders/${userId}`);
  };

  return (
    <div className="list-orders">
      <h2>Orders List</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>View Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => viewOrders(user.id)}>View Orders</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListOrders;
