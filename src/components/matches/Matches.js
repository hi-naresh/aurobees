import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// import { db } from '../../firebase';
import database from '../../firebase';

import './Matches.css';

const Matches = () => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (currentUser) {
        database.collection('matches').doc(currentUser.uid).collection('userMatches').onSnapshot((snapshot) => {
        const fetchedMatches = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setMatches(fetchedMatches);
        setLoading(false);
      }, (error) => {
        setError("Failed to fetch matches.");
        setLoading(false);
      });
    }
  }, [currentUser]);

  return (
    <div className="matches-container">
      <h1>Your Matches</h1>
      
      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => (
            <div key={match.id} className="match-item">
              <img src={match.imageUrl} alt={match.name} />
              <div>{match.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
