import React, { Component } from 'react';
import NavBar from '../../components/NavBar';

// Styles
import '../../assets/fonts/fontawesome-free-5.0.13/fontawesome-all.js';
import '../../assets/css/App.css';
import '../../assets/css/loading-container.css';
import '../../assets/css/sign-up-container.css';
import '../../assets/css/navbar.css';

import '../../assets/css/board-container.css';
import '../../assets/css/start-topic-container.css';
import '../../assets/css/topic-container.css';
import '../../assets/css/profile-container.css';

class CoreLayout extends Component {
    render() {
        return (
            <div className="App">
                <NavBar/>
                <div className="page-container">
                    <aside className="left-side-panel">
                    </aside>
                    <div className="main-panel">
                        <div className="view-container">
                            {this.props.children}
                        </div>
                    </div>
                    <aside className="right-side-panel">
                    </aside>
                </div>
            </div>
        );
    }
}

export default CoreLayout;