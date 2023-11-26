import React, { useState, useEffect } from "react";
import { database, storage, firebase } from "../../../firebase";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import '../../../styles/GlobalStyles.css'
import { useSnackbar } from "../../common/SnackBar";

const Bio = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [newImage] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const { openSnackbar } = useSnackbar(); // Use the hook

  // Load existing user data
  useEffect(() => {
    if (currentUser) {
      database
        .collection("users")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          }
        })
        .catch((error) => {
          setError("Failed to fetch data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    setLoading(true);

    let updatedPhotos = userData.photos || []; // Get existing photos or start with an empty array

    try {
      // Save new profile image to Firebase Storage if it's present
      if (newImage) {
        const imageRef = storage.ref(
          `profileImages/${currentUser.uid}/${newImage.name}`
        );
        await imageRef.put(newImage);
        const newImageUrl = await imageRef.getDownloadURL();
        updatedPhotos = [...updatedPhotos, newImageUrl]; // Append new image URL to the array
      }

      // Prepare updated user data
      const updatedUserData = {
        ...userData,
        bio: userData.bio,
        lookingFor: userData.lookingFor,
        interests: userData.interests,
        photos: updatedPhotos, // Updated photos array
      };

      // Save updated user data to Firestore
      await database
        .collection("users")
        .doc(currentUser.uid)
        .update(updatedUserData);
      setError(null);
        history.push("/profile");
        openSnackbar("Profile updated successfully");
    } catch (error) {
      setError("Failed to save profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const uploadImage = async (file) => {
    const imageRef = storage.ref(
      `profileImages/${currentUser.uid}/${file.name}`
    );
    await imageRef.put(file);
    return await imageRef.getDownloadURL();
  };

  const renderImageGrid = (image, index) => {
    // Unique input ID for each file input
    const inputId = `image-upload-input-${index}`;

    const handleFileSelect = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = await uploadImage(file);
        setUserData((prevData) => {
          const updatedPhotos = [...prevData.photos];
          updatedPhotos[index] = imageUrl; // This ensures that the correct image URL is placed at the correct index
          return { ...prevData, photos: updatedPhotos };
        });
        // Update Firestore, if you want to replace the image at the specific index, consider using array update operators or a different method
        await database
          .collection("users")
          .doc(currentUser.uid)
          .update({
            photos: firebase.firestore.FieldValue.arrayUnion(imageUrl),
          });
      }
    };

    return (
      <div key={index} className="image-grid-item">
        <label htmlFor={inputId} className="image-upload-label">
          {image ? (
            <img src={image} alt={`Uploaded ${index}`} />
          ) : (
            <div className="image-upload-placeholder">
              {/* SVG or icon can go here if you want to display an icon for empty image slots */}
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-plus"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          )}
          <input
            id={inputId}
            type="file"
            onChange={handleFileSelect}
            className="image-upload-input"
            style={{ display: "none" }} // Hide the input element
          />
        </label>
      </div>
    );
  };

  return (
    <div className="container">
        <h2>My Profile</h2>
      {loading && <div className="error">{error}</div>}
      <div className="image-grid">
        {[0, 1, 2, 3].map((index) =>
          renderImageGrid(
            userData.photos ? userData.photos[index] : null,
            index
          )
        )}
      </div>
      
      <h2>My bio</h2>
      <p>Write a funny and catchy punchline</p>
      <input
        name="bio"
        value={userData.bio || ""}
        onChange={handleChange}
      ></input>
      
      <button className="fixed-next-button" onClick={handleSaveProfile}>
        Update Profile
      </button>
    </div>
  );
};

export default Bio;
