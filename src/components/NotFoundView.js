import React from 'react';

const NotFoundView = (props) => {
    return (
        <div style={{textAlign: "center"}}>
            <img src={require('../resources/PageNotFound.jpg')} alt="Page not found!"/>
        </div>
    );
};

export default NotFoundView;