import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { push } from 'connected-react-router'
import PropTypes from 'prop-types';
import { Image, Menu } from 'semantic-ui-react'

import logo from '../assets/images/logo.png';

class NavBarContainer extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Menu fixed='top' inverted>
                <Menu.Item onClick={() => {this.props.navigateTo('/')}}>
                    <Image
                        size='mini'
                        src={logo}
                        style={{ marginRight: '1.5em' }}
                    />
                        Apella
                </Menu.Item>
                <Menu.Item onClick={() => {this.props.navigateTo('/signup')}}>
                    SignUp
                </Menu.Item>
            </Menu>
        );
    }
}

NavBarContainer.contextTypes = {
    router: PropTypes.object
};

const mapDispatchToProps = dispatch => bindActionCreators({
    navigateTo: (location) => push(location)
}, dispatch);

const mapStateToProps = state => {
    return {
        hasSignedUp: state.user.hasSignedUp,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
