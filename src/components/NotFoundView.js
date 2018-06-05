import React from 'react';

const NotFoundView = (props) => {
    return (
        <div className="pure-u-1-1 center">
            <img src={require('../resources/PageNotFound.jpg')} alt="Page not found!"/>
        </div>
    );
};

export default NotFoundView;