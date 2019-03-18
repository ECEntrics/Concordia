import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Image, Menu } from 'semantic-ui-react';

import logo from '../assets/images/logo.png';

const NavBarContainer = ({ hasSignedUp, navigateTo, navBarTitle }) => (
  <Menu fixed="top" inverted>
    <Menu.Item header onClick={() => { navigateTo('/'); }}>
      <Image
        size="mini"
        src={logo}
        style={{
          marginRight: '1.5em'
        }}
      />
        Apella
    </Menu.Item>
    <Menu.Item onClick={() => { navigateTo('/home'); }}>
        Home
    </Menu.Item>
    {hasSignedUp
      ? (
        <Menu.Item onClick={() => { navigateTo('/profile'); }}>
            Profile
        </Menu.Item>
      )
      : (
        <Menu.Menu
          position="right"
          style={{
            backgroundColor: '#00b5ad'
          }}
        >
          <Menu.Item onClick={() => { navigateTo('/signup'); }}>
              SignUp
          </Menu.Item>
        </Menu.Menu>
      )
      }
    <div className="navBarText">
      {navBarTitle !== ''
        && <span>{navBarTitle}</span>}
    </div>
  </Menu>
);

NavBarContainer.propTypes = {
  hasSignedUp: PropTypes.bool.isRequired,
  navigateTo: PropTypes.func.isRequired,
  navBarTitle: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateTo: location => push(location)
}, dispatch);

const mapStateToProps = state => ({
  hasSignedUp: state.user.hasSignedUp,
  navBarTitle: state.interface.navBarTitle
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
