import React from 'react';

const NotFoundView = (props) => {
    return (
        <div className="center">
            <img src={require('../resources/PageNotFound.jpg')} alt="Page not found!"/>
        </div>
    );
};

export default NotFoundView;