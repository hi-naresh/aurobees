import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import database from '../../firebase';
import './Settings.css'; // Path to your CSS file for styling
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function SettingsPage() {
  const [profile, setProfile] = useState({});
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = database
        .collection("users")
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setProfile(doc.data());
          } else {
            // Handle the error of no document found
          }
        }, (error) => {
          console.error("Failed to fetch data", error);
        });

      // Cleanup the listener on unmount
      return () => unsubscribe();
    }
  }, [currentUser]);

  const SettingTile = ({ title, link, }) => (
    <div className="setting-tile">
      <Link to={link} className="setting-link">
        {title}
      </Link>
      <span className="arrow">{'>'}</span>
    </div>
  );

  const handleLogout = async () => {
    try {
      await logout();
      history.push("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <div className="settings-page">
      <div className="explore-header">
        <img className="header__image" src="assets/abees.png" alt="Abees" />
        <h2>Profile</h2>
        <img
          className="header__icon"
          height={"28px"}
          src="assets/setting-4.png"
          alt="Filter"
        />
      </div>
      
      <div className="profile-section">
        <img src={profile.photos ? profile.photos[0] : 'defaultProfilePic.jpg'} alt={profile.name || 'Profile'} className="profile-pic" />
        <div className="profile-info">
          <p className="profile-name-age">{profile.name}, {profile.age}</p>
        </div>
      </div>
      <div className="settings-body">
        <SettingTile title="Bio & pics" link="/bio-pics" />
        <SettingTile title="Info & tags" link="/info-tags" />
        <SettingTile title="Personality" link="/personality" />        
        <h2>Account</h2>
        <SettingTile title="Notifications" link="/notifications" />
        <SettingTile title="Change password" link="/change-password" />
        <SettingTile title="Deactivate account" link="/deactivate-account" />
        <div className="setting-tile">
          <button  
          className="setting-link" 
          onClick={handleLogout}
          >Logout</button>
        </div>
      </div>

    </div>
  );
}

export default SettingsPage;
