import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ component: Component, ...rest }) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                // If there's a current user, redirect to the profile page
                return !currentUser ? <Component {...props} /> : <Redirect to="/swipe" />;
            }}
        />
    );
};

export default PublicRoute;
