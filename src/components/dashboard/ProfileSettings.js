import React from 'react';

const ProfileSettings = () => {
  return (
    <div style={{ width: '350px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Signal</span>
        <span>22:20</span>
        <span>Battery 28%</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Dozie, 49</h2>
        <p>Increase your chances</p>
        <p>Get unlimited likes with Tinder Plus!</p>
        <button style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '5px' }}>
          MY TINDER PLUS
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
