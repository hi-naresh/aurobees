import React, { createContext, useState, useContext, useEffect } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {auth} from "../firebase";

// const auth = firebase.auth();
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = (email, password) => {
        if (!email.endsWith("@aurouniversity.edu.in")) {
            return Promise.reject(new Error("Please use your Auro University email"));
        }
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const login = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    const logout = () => {
        return firebase.auth().signOut();
      };      
    

    const value = {
        currentUser,
        setCurrentUser,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
