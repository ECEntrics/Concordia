import React, { Component } from 'react';

import NavBarContainer from './NavBarContainer';
/*import TransactionsMonitorContainer from '../../containers/TransactionsMonitorContainer';*/

// Styles
import '../assets/fonts/fontawesome-free-5.7.2/all.js'; //TODO: check https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers
import '../assets/css/App.css';
import '../assets/css/sign-up-container.css';

import '../assets/css/board-container.css';
import '../assets/css/start-topic-container.css';
import '../assets/css/topic-container.css';
import '../assets/css/profile-container.css';

class CoreLayout extends Component {
    render() {
        return (
            <div className="App">
                <NavBarContainer/>
                {/*<div className="progress-bar-container"
                    style={{display: this.props.isProgressBarVisible ? "block" : "none"}}>
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                </div>*/}
                <div className="page-container">
                    <aside className="left-side-panel">
                    </aside>
                    <div className="main-panel">
                        <div className="view-container">
                            {this.props.children}
                        </div>
                    </div>
                    <aside className="right-side-panel">
                        TransactionsMonitorContainer
                    </aside>
                </div>
            </div>
        );
    }
}

export default CoreLayout
