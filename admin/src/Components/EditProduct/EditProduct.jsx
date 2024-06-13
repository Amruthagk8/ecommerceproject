import React, { useState, useEffect } from 'react';
import './EditProduct.css';

export const EditProduct = ({ product, onUpdate, onCancel }) => {
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });
    const [newImages, setNewImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        console.log("e.target",e.target)
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        setNewImages([...e.target.files]);
    };

    const removeImage = (index) => {
        const updatedImages = [...updatedProduct.images];
        updatedImages.splice(index, 1);
        setUpdatedProduct({ ...updatedProduct, images: updatedImages });
    };

    const handleSubmit = async () => {
        let formData = new FormData();
        newImages.forEach(image => formData.append('product', image));

        // Upload new images if any
        if (newImages.length > 0) {
            
            const response = await fetch('http://localhost:5000/api/v1/task/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            const responseData = await response.json();

            if (responseData.success) {
                updatedProduct.images = [...updatedProduct.images, ...responseData.image_urls];
            } else {
                console.error('Upload failed:', responseData.message);
                return;
            }
        }
console.log("updatedPrdoctdetails",updatedProduct)
        // Update product details
        const response = await fetch('http://localhost:5000/api/v1/task/updateproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        const result = await response.json();

        if (result.success) {
            onUpdate();
        } else {
            console.error('Update failed:', result.message);
        }
    };

    return (
        <div className="edit-product">
            <h2>Edit Product</h2>
            <div className="edit-product-field">
                <label>Title</label>
                <input type="text" name="name" value={updatedProduct.name} onChange={handleInputChange} />
            </div>
            <div className="edit-product-field">
                <label>Old Price</label>
                <input type="text" name="old_price" value={updatedProduct.old_price} onChange={handleInputChange} />
            </div>
            <div className="edit-product-field">
                <label>New Price</label>
                <input type="text" name="new_price" value={updatedProduct.new_price} onChange={handleInputChange} />
            </div>
            <div className="edit-product-field">
                <label>Category</label>
                <select name="category" value={updatedProduct.category} onChange={handleInputChange}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="edit-product-field">
                <label>Quantity</label>
                <input type="number" name="quantity" value={updatedProduct.quantity} onChange={handleInputChange} />
            </div>
            <div className="edit-product-field">
                <label>Images</label>
                {updatedProduct.images.map((image, index) => (
                    <div key={index} className="edit-product-image">
                        <img src={image} alt={`Product ${index + 1}`} />
                        <button onClick={() => removeImage(index)}>Remove</button>
                    </div>
                ))}
                <input type="file" multiple onChange={handleImageChange} />
            </div>
            <button onClick={handleSubmit}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};
