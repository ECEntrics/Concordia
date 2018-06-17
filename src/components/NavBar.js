import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Image, Menu } from 'semantic-ui-react'

class NavBar extends Component {
    constructor(props){
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);

        this.navRef = React.createRef();
    }

    handleItemClick(to) {
        this.context.router.push(to);
    }

    render() {
        return (
            <Menu fixed='top' inverted>
                <Menu.Item header onClick={() => {this.handleItemClick("/")}}>
                    <Image
                        size='mini'
                        src={require('../resources/logo.png')}
                        style={{ marginRight: '1.5em' }}
                    />
                    Apella
                </Menu.Item>
                <Menu.Item onClick={() => {this.handleItemClick("/")}}>
                    Home
                </Menu.Item>
                {this.props.hasSignedUp
                    ? <Menu.Item onClick={() => {this.handleItemClick("/profile")}}>
                        Profile
                    </Menu.Item>
                    :<Menu.Menu position='right'>
                        <Menu.Item onClick={() => {this.handleItemClick("/signUp")}}>
                            Sign Up
                        </Menu.Item>
                    </Menu.Menu>
                }
            </Menu>
        );
    }
};

NavBar.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
  return {
    hasSignedUp: state.user.hasSignedUp
  }
};

export default drizzleConnect(NavBar, mapStateToProps);