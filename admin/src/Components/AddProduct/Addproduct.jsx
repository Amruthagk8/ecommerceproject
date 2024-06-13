import React, { useState } from 'react';
import './Addproduct.css';
import upload_area from '../../Assets/upload_area.svg';

export const Addproduct = () => {
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]); // State for image previews
    const [productDetails, setProductDetails] = useState({
        name: "",
        images: [],
        category: "",
        old_price: "",
        new_price: "",
        quantity: ""
    });

    const Add_Product = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        images.forEach(image => formData.append('product', image));

        try {
            const response = await fetch('http://localhost:5000/api/v1/task/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
            responseData = await response.json();
            
            if (responseData.success) {
                product.images = responseData.image_urls;
                console.log(product);
                // Now send product details to the server
                const addProductResponse = await fetch('http://localhost:5000/api/v1/task/addproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });
                const addProductData = await addProductResponse.json();

                if (addProductData.success) {
                    alert("Product Added!!");
                    window.location.reload(); // Refresh the page
                } else {
                    console.error('Error adding product:', addProductData.message);
                }
            } else {
                console.error('Upload failed:', responseData.message);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    const imageHandler = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages(selectedFiles);

        const imagePreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(imagePreviews);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfeild">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfeild">
                    <p>Price</p>
                    <input type="text" value={productDetails.old_price} onChange={changeHandler} name="old_price" placeholder='Type here' />
                </div>
                <div className="addproduct-itemfeild">
                    <p>Offer Price</p>
                    <input type="text" value={productDetails.new_price} onChange={changeHandler} name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfeild">
                <p>Product Category</p>
                <select name="category" value={productDetails.category} onChange={changeHandler} className='add-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfeild">
                <p>Quantity</p>  {/* Add label for quantity */}
                <input type="number" value={productDetails.quantity} onChange={changeHandler} name="quantity" placeholder='Type here' />
            </div>
            <div className="addproduct-itemfeild">
                <label htmlFor="file-input">
                    <img src={imagePreviews.length ? imagePreviews[0] : upload_area} className='addproduct-thumnail-img' alt="" />
                </label>
                <input type="file" onChange={imageHandler} name="image" id="file-input" hidden multiple />
            </div>
            <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} className='addproduct-thumbnail-img' alt={`Preview ${index + 1}`} />
                ))}
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    );
};
