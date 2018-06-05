import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';
import NavBar from '../../components/NavBar';

// Styles
import '../../assets/fonts/fontawesome-free-5.0.13/fontawesome-all.js';
import '../../assets/css/oswald.css';
import '../../assets/css/open-sans.css';
import '../../assets/css/pure-min.css';
import '../../assets/css/App.css';

class CoreLayout extends Component {
  render() {
    return (
      <div className="App">
        <HeaderBar/>
        <NavBar/>
        <div className="view-container">
            {this.props.children}
        </div>
      </div>
    );
  }
}

export default CoreLayout;