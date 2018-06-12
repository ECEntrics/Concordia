import React from 'react';
import { Link } from 'react-router';

const FloatingButton = (props) => {
    return (
        <div>
            {props.to
                ?<div className="fixed-action-btn">
                    <Link className="btn-floating btn-large waves-effect waves-light teal lighten-1"
                        to={props.to}>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
                :<div className="fixed-action-btn">
                    <p className="btn-floating btn-large waves-effect waves-light teal lighten-1"
                        onClick={props.onClick}>
                        <i className="large material-icons">add</i>
                    </p>
                </div>
            }
        </div>
    );
};

export default FloatingButton;