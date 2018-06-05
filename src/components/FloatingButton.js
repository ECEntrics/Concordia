import React from 'react';

const FloatingButton = (props) => {
    return (
        <div className="pure-u-1-1">
            <p className="no-margin floating-button" data-fa-transform="down-6" onClick={props.onClick}>
                <i className="fa fa-plus fa-2x"></i>
            </p>
        </div>
    );
};

export default FloatingButton;