import React, { useEffect, useState } from 'react';
import './Listusers.css';
import cross_icon from '../../Assets/cross_icon.png';

export const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/task/allusers');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleUserBlock = async (id, isBlocked) => {
    try {
        const url = isBlocked ? 'http://localhost:5000/api/v1/task/unblockuser' : 'http://localhost:5000/api/v1/task/blockuser';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to toggle user block status');
        }

        console.log(`Successfully toggled block status for user ID: ${id}`); // Add this line

        await fetchUsers(); // Refetch the users to update the UI
    } catch (error) {
        console.error('Error toggling user block status:', error.message);
    }
};


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


        return (
            <div className='list-users'>
                <h1>All Users List</h1>
                <table className="listusers-allusers">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="listusers-format">
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.blocked === true? (
                                        <button onClick={() => { toggleUserBlock(user.id, true) }}>Unblock</button>
                                    ) : (
                                        <button onClick={() => { toggleUserBlock(user.id, false) }}>Block</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
        
    
}
