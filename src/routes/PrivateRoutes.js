import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { currentUser } = useAuth();
    const history = useHistory();

    // Add your own authentication on the below line.
    // const isLoggedIn = currentUser;
    // const isLoggedIn = true;
    // const isLoggedIn = currentUser && currentUser.emailVerified;
    // const isLoggedIn = currentUser && currentUser.emailVerified;
    useEffect(() => {
        if (!currentUser?.emailVerified) {
          history.push('/email-verify');
        }
      }, [currentUser, history]);


    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to="/login" />;
            }}
        />
    );
};

export default PrivateRoute;
