import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { database } from '../../../firebase';


function PersonalDetails() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState(''); 
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const history = useHistory();
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here, you would typically send this data to Firestore
        await database.collection('users').doc(currentUser.uid).set({ name,gender,age, department, year });
        history.push('/photo-upload');
    };

    return (
        <div className="login-container">
            <h2 className='head-text'>Personal</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <select // Use a select input for gender
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                </select>
                <input 
                    type="number" 
                    placeholder="Age" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)} 
                    required 
                />
                <select // Use a select input for gender
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    >
                    <option value="">School Department</option>
                    <option value="IT">IT</option>
                    <option value="BBA">BBA</option>
                    <option value="BA">BA</option>
                    <option value="Design">Design</option>
                    <option value="MBA">MBA</option>
                    <option value="LAW">LAW</option>
                    <option value="BHM">BHM</option>
                    <option value="BCOM">BCOM</option>
                    <option value="BJMC">BJMC</option>
                </select>
                <input 
                    type="number" 
                    placeholder="Year" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)} 
                    required 
                />
                <button className='fixed-next-button' type="submit">Next</button>
            </form>
        </div>
    );
}

export default PersonalDetails;
