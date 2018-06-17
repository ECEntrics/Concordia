import React from 'react';

const LoadingSpinner = (props) => {
    return(
        <div className="vertical-center-children">
            <div className={"center-in-parent " + (props.className ? props.className : "")}
                style={props.style ? props.style : []}>
                <p>
                    <i className="fas fa-spinner fa-3x fa-spin"></i>
                </p>
            </div>
        </div>
    );
}

export default LoadingSpinner;