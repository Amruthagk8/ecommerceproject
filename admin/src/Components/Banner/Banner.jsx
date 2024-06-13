import React, { useState, useEffect } from 'react';
import './Banner.css';
//import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


export const Banner = () => {
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    description: '',
    startDate: '',
    endDate: '',
    status: 'inactive',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/fetchbanners');
        const result = await response.json();
        if (result.success) {
          setBanners(result.banners);
        } else {
          alert('Error fetching banners: ' + result.message);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        alert('Error fetching banners. Please try again later.');
      }
    };

    fetchBanners();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBanner({ ...newBanner, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBanner({ ...newBanner, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', newBanner.image);

    try {
      const uploadResponse = await fetch('http://localhost:5000/api/v1/task/uploadbannerimage', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error('Image upload failed: ' + uploadResult.message);
      }

      const imageUrl = uploadResult.image_url;

      const bannerData = {
        description: newBanner.description,
        startDate: newBanner.startDate,
        endDate: newBanner.endDate,
        status: newBanner.status,
        image: imageUrl,
      };

      const response = await fetch('http://localhost:5000/api/v1/task/banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Banner created successfully!');
        setBanners([...banners, result.banner]);
        setNewBanner({
          description: '',
          startDate: '',
          endDate: '',
          status: 'inactive',
          image: null,
        });
        setImagePreview(null);
        setIsAddingBanner(false);
      } else {
        alert('Error creating banner: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      alert('Error creating banner. Please try again later.');
    }
  };

  const handleEditBanner = (banner) => {
    setNewBanner({
      description: banner.description,
      startDate: banner.startDate.split('T')[0], // Split date to avoid time part
      endDate: banner.endDate.split('T')[0], // Split date to avoid time part
      status: banner.status,
      image: null,
    });
    setCurrentBannerId(banner._id);
    setImagePreview(banner.image);
    setIsEditingBanner(true);
    setIsAddingBanner(false); // Close the add form if it's open
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();

    const bannerData = {
      description: newBanner.description,
      startDate: newBanner.startDate,
      endDate: newBanner.endDate,
      status: newBanner.status,
    };

    if (newBanner.image) {
      const formData = new FormData();
      formData.append('image', newBanner.image);

      try {
        const uploadResponse = await fetch('http://localhost:5000/api/v1/task/uploadbannerimage', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          throw new Error('Image upload failed: ' + uploadResult.message);
        }

        bannerData.image = uploadResult.image_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again later.');
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/task/update-banner/${currentBannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Banner updated successfully!');
        const updatedBanners = banners.map((banner) =>
          banner._id === currentBannerId ? result.banner : banner
        );
        setBanners(updatedBanners);
        setNewBanner({
          description: '',
          startDate: '',
          endDate: '',
          status: 'inactive',
          image: null,
        });
        setImagePreview(null);
        setIsEditingBanner(false);
        setCurrentBannerId(null);
      } else {
        alert('Error updating banner: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Error updating banner. Please try again later.');
    }
  };

  const handleDeleteBanner = async (index) => {
    const bannerToDelete = banners[index];
    try {
      const response = await fetch(`http://localhost:5000/api/v1/task/delete-banner/${bannerToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        const updatedBanners = banners.filter((_, i) => i !== index);
        setBanners(updatedBanners);
      } else {
        alert('Error deleting banner:', result.message);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const renderBannerList = () => {
    return banners.map((banner, index) => (
      <div key={index} className="banner-item">
        <div className="banner-details">
          <p>{banner.description}</p>
          <p>{new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}</p>
          <p>Status: {banner.status}</p>
          <img src={banner.image} alt="Banner" />
        </div>
        <div className="banner-actions">
          <button className="edit-button" onClick={() => handleEditBanner(banner)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="delete-button" onClick={() => handleDeleteBanner(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    ));
  };

  const renderAddBannerForm = () => (
    <form onSubmit={handleSubmit} className="banner-form">
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={newBanner.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="start-date">Start Date</label>
        <input
          type="date"
          id="start-date"
          name="startDate"
          value={newBanner.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="end-date">End Date</label>
        <input
          type="date"
          id="end-date"
          name="endDate"
          value={newBanner.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={newBanner.status}
          onChange={handleChange}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected" />
          </div>
        )}
      </div>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );

  const renderEditBannerForm = () => (
    <form onSubmit={handleUpdateBanner} className="banner-form">
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={newBanner.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="start-date">Start Date</label>
        <input
          type="date"
          id="start-date"
          name="startDate"
          value={newBanner.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="end-date">End Date</label>
        <input
          type="date"
          id="end-date"
          name="endDate"
          value={newBanner.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={newBanner.status}
          onChange={handleChange}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected" />
          </div>
        )}
      </div>
      <button type="submit" className="submit-button">Update</button>
    </form>
  );

  return (
    <div className="banner-container">
      <h2>Your Banners</h2>
      {renderBannerList()}
      <button className="add-banner-button" onClick={() => setIsAddingBanner(!isAddingBanner)}>
        <span className="icon">➕</span>
        {isAddingBanner ? 'Close Form' : 'Add Banner'}
      </button>
      {isAddingBanner && renderAddBannerForm()}
      {isEditingBanner && renderEditBannerForm()}
    </div>
  );
};
