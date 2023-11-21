import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import database, { storage } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';

function PhotoUpload() {
    const [images, setImages] = useState(new Array(4).fill(null)); // An array for 4 images
    const history = useHistory();
    const { currentUser } = useAuth();

    const handleImageUpload = async (file, index) => {
        const uploadTask = storage.ref(`images/${currentUser.uid}/${file.name}`).put(file);
        const snapshot = await uploadTask;
        const imageUrl = await snapshot.ref.getDownloadURL();

        // Update the images array with the new image URL
        setImages(currentImages => {
            const updatedImages = [...currentImages];
            updatedImages[index] = imageUrl;
            return updatedImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filter out null values, as we only want to update with actual images
        const imageUrls = images.filter(image => image !== null);

        // Update the user's profile with these image URLs
        await database.collection('users').doc(currentUser.uid).update({ photos: imageUrls });

        history.push('/interests-form');
    };

    const renderImageInput = (image, index) => {
        return (
            <div key={index} className="image-upload-container">
                {image ? (
                    <div className="image-preview">
                        <img src={image} alt={`Uploaded ${index}`} />
                    </div>
                ) : (
                    <label className="image-upload-label">
                        <input 
                            type="file" 
                            onChange={(e) => handleImageUpload(e.target.files[0], index)} 
                            className="image-upload-input"
                        />
                        <div className="image-upload-button">
                            {/* Here you can use an SVG or an icon from a library */}
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </label>
                )}
            </div>
        );
    };

    return (
        <div className="login-container">
            <h2 className='head-text'>Photos</h2>
            <form onSubmit={handleSubmit}>
                <div className="image-grid">
                    {images.map(renderImageInput)}
                </div>
                <button className='fixed-next-button' type="submit">Next</button>
            </form>
        </div>
    );
}

export default PhotoUpload;
