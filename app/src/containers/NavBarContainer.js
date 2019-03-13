import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Image, Menu } from 'semantic-ui-react';

import logo from '../assets/images/logo.png';

class NavBarContainer extends Component {
  render() {
    return (
      <Menu fixed="top" inverted>
        <Menu.Item header onClick={() => { this.props.navigateTo('/'); }}>
          <Image
            size="mini"
            src={logo}
            style={{
              marginRight: '1.5em'
            }}
          />
            Apella
        </Menu.Item>
        <Menu.Item onClick={() => { this.props.navigateTo('/home'); }}>
            Home
        </Menu.Item>
        {this.props.hasSignedUp
          ? (
            <Menu.Item onClick={() => { this.props.navigateTo('/profile'); }}>
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
              <Menu.Item onClick={() => { this.props.navigateTo('/signup'); }}>
                  SignUp
              </Menu.Item>
            </Menu.Menu>
          )
          }
        <div className="navBarText">
          {this.props.navBarTitle !== ''
            && <span>{this.props.navBarTitle}</span>}
        </div>
      </Menu>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateTo: location => push(location)
}, dispatch);

const mapStateToProps = state => ({
  hasSignedUp: state.user.hasSignedUp,
  navBarTitle: state.interface.navBarTitle
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
