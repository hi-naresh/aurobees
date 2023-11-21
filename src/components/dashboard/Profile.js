import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { database, storage, firebase } from "../../firebase";
import "./Profile.css";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [newImage] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const { logout } = useAuth();

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

  // Save new profile information
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
    } catch (error) {
      setError("Failed to save profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component code...

  const handleLogout = async () => {
    try {
      await logout();
      history.push("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleImageChange = async (index) => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.onchange = async (e) => {
  //     const file = e.target.files[0];
  //     const imageUrl = await uploadImage(file);
  //     setUserData((prevData) => {
  //       const updatedPhotos = [...prevData.photos];
  //       updatedPhotos[index] = imageUrl;
  //       return { ...prevData, photos: updatedPhotos };
  //     });
  //     // Update Firestore
  //     await database
  //       .collection("users")
  //       .doc(currentUser.uid)
  //       .update({ photos: firebase.firestore.FieldValue.arrayUnion(imageUrl) });
  //   };
  //   input.click();
  // };
  // const handleRemoveImage = async (index) => {
  //   const updatedPhotos = userData.photos.filter((_, idx) => idx !== index);
  //   setUserData({ ...userData, photos: updatedPhotos });
  //   // Update Firestore
  //   await database
  //     .collection("users")
  //     .doc(currentUser.uid)
  //     .update({ photos: updatedPhotos });
  // };

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
    <div className="login-container">
      <h1>Edit Profile</h1>
      {error && <div className="error">{error}</div>}
      <div className="image-grid">
        {/* Display 4 image grids */}
        {[0, 1, 2, 3].map((index) =>
          renderImageGrid(
            userData.photos ? userData.photos[index] : null,
            index
          )
        )}
      </div>
      <label>Bio:</label>
      <input
        name="bio"
        value={userData.bio || ""}
        onChange={handleChange}
      ></input>
      <label>Looking For :</label>
      <input
        name="lookingFor"
        value={userData.lookingFor || ""}
        onChange={handleChange}
      ></input>
      <label>Interests:</label>
      <input
        type="text"
        name="interests"
        value={userData.interests || ""}
        onChange={handleChange}
      />
      <button onClick={handleSaveProfile} disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </button>
      <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
    </div>
  );
};

export default Profile;
