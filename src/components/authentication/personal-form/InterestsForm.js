import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'
import { database } from '../../../firebase';


function InterestsForm() {
    const [interests, setInterests] = useState('');
    const [genderInterest, setGenderInterest] = useState('');
    const [lookingFor, setLookingFor] = useState('');
    const history = useHistory();
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit all collected data to Firebase
        await database.collection('users').doc(currentUser.uid).update({ interests, genderInterest, lookingFor });
        history.push('/swipe'); // Redirect to the swipe screen
    };

    return (
        <div className="login-container">
            <h2 className='head-text'>Interests</h2>
            <form onSubmit={handleSubmit}>
                <select // Use a select input for gender
                    value={genderInterest}
                    onChange={(e) => setGenderInterest(e.target.value)}
                    required
                    >
                    <option value="">Select Interested Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                </select>
                <select // Use a select input for gender
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    required
                    >
                    <option value="">Looking for</option>
                    <option value="Relationship">Relationship</option>
                    <option value="Casual">Casual</option>
                    <option value="Friendship">Friendship</option>
                    <option value="I don't know yet">I don't know yet</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <input 
                    placeholder="Interests" 
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)} 
                    required 
                />
                <button className='fixed-next-button' type="submit">Finish</button>
            </form>
        </div>
    );
}

export default InterestsForm;
