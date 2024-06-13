import React, { useEffect, useState } from 'react';
import './Listproduct.css';
import cross_icon from '../../Assets/cross_icon.png';
import { EditProduct } from '../EditProduct/EditProduct';  // Import the EditProduct component

export const Listproduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);  // Track the product being edited

    const fetchInfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/task/allproducts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setAllProducts(data.products);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        await fetch("http://localhost:5000/api/v1/task/removeproduct", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        await fetchInfo();
    };

    const toggleAvailability = async (id, currentAvailability) => {
        await fetch("http://localhost:5000/api/v1/task/toggleavailability", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ id: id, available: !currentAvailability })
        });
        await fetchInfo();
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleUpdate = () => {
        setEditingProduct(null);
        fetchInfo();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='list-product'>
            <h1>All Products List</h1>
            {editingProduct ? (
                <EditProduct product={editingProduct} onUpdate={handleUpdate} onCancel={() => setEditingProduct(null)} />
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Title</th>
                            <th>Old Price</th>
                            <th>New Price</th>
                            <th>Category</th>
                            <th>Availability</th>
                            <th>Quantity</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allproducts.map((product, index) => (
                            <tr key={index}>
                                <td>
                                    {product.images.map((image, idx) => (
                                        <img key={idx} src={image} alt={`Product ${index + 1} Image ${idx + 1}`} className="listproduct-product-icon" />
                                    ))}
                                </td>
                                <td>{product.name}</td>
                                <td>${product.old_price}</td>
                                <td>${product.new_price}</td>
                                <td>{product.category}</td>
                                <td>
                                    <button
                                        onClick={() => toggleAvailability(product.id, product.available)}
                                        className={`availability-button ${product.available ? 'available' : 'unavailable'}`}>
                                        {product.available ? 'Available' : 'Unavailable'}
                                    </button>
                                </td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>Edit</button>
                                </td>
                                <td>
                                    <img src={cross_icon} onClick={() => remove_product(product.id)} className='listproduct-remove-icon' alt="" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
