import React, { Component } from 'react';
import { push } from 'connected-react-router'
import PropTypes from 'prop-types';

import { Image, Menu } from 'semantic-ui-react'

import logo from '../resources/logo.png';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class NavBar extends Component {
    constructor(props){
        super(props);

       // this.handleItemClick = this.handleItemClick.bind(this);

        this.navRef = React.createRef();
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

NavBar.contextTypes = {
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

//export default drizzleConnect(NavBar, mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
