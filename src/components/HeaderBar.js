import React from 'react';

const HeaderBar = (props) => {
    return (
        <div className="header-bar">
            <img className="logo" src={require('../resources/logo.png')} alt="logo"/>
            <div className="inline header-bar-text">
                <div>
                    <div>
                        <h1 className="no-margin">Welcome to Apella</h1>
                        <p className="no-margin">A decentralized forum</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderBar;