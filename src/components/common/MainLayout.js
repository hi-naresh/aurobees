import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
    return (
        <>
            <div className='main-content'>{children}</div>
            <Header />
        </>
    );
};

export default MainLayout;
