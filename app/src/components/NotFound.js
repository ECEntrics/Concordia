import React from 'react';
import pageNotFound from '../assets/images/PageNotFound.jpg';

const NotFound = () => {
    return (
        <div style={{textAlign: "center"}}>
            <img src={pageNotFound} alt="Page not found!"/>
        </div>
    );
};

export default NotFound;