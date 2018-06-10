import React from 'react';
import { Link } from 'react-router';

const FloatingButton = (props) => {
    return (
        <div className="pure-u-1-1">
            {props.to
                ?<Link to={props.to}>
                    <p className="no-margin floating-button" data-fa-transform="down-6">
                        <i className="fa fa-plus fa-2x"></i>
                    </p>
                </Link>
                :<p className="no-margin floating-button" data-fa-transform="down-6" onClick={props.onClick}>
                    <i className="fa fa-plus fa-2x"></i>
                </p>
            }
        </div>
    );
};

export default FloatingButton;