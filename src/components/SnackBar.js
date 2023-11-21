// SnackbarContext.js
import React, { createContext, useContext, useState } from 'react';
import './Snackbar.css';

const SnackbarContext = createContext();

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const openSnackbar = (message) => {
        setSnackbar({ open: true, message });
        setTimeout(() => {
            setSnackbar({ open: false, message: '' });
        }, 2000); // close after 3 seconds
    };

    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            {children}
            {snackbar.open && <div className="snackbar">{snackbar.message}</div>}
        </SnackbarContext.Provider>
    );
};
