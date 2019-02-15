import React from 'react';
import pageNotFound from '../resources/PageNotFound.jpg';

const NotFound = () => {
    return (
        <div style={{textAlign: "center"}}>
            <img src={pageNotFound} alt="Page not found!"/>
        </div>
    );
};

export default NotFound;