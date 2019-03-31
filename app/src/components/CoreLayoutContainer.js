import React from 'react';
import PropTypes from 'prop-types';

import NavBarContainer from '../containers/NavBarContainer';
import RightSideBarContainer from '../containers/TransactionsMonitorContainer';
// Styles
import '../assets/fonts/fontawesome-free-5.7.2/all.js'; // TODO: check https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers
import '../assets/css/App.css';
import '../assets/css/sign-up-container.css';

import '../assets/css/board-container.css';
import '../assets/css/start-topic-container.css';
import '../assets/css/topic-container.css';
import '../assets/css/profile-container.css';

const CoreLayout = ({ children }) => (
  <div className="App">
    <NavBarContainer />
    {/* <div className="progress-bar-container"
                style={{display: this.props.isProgressBarVisible ? "block" : "none"}}>
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div> */}
    <div className="page-container">
      <aside className="left-side-panel" />
      <div className="main-panel">
        <div className="view-container">
          {children}
        </div>
      </div>
      <aside className="right-side-panel">
        <RightSideBarContainer />
      </aside>
    </div>
  </div>
);

CoreLayout.propTypes = {
  children: PropTypes.objectOf(PropTypes.object)
};

export default CoreLayout;
