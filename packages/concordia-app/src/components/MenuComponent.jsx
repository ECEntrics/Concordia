import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Menu } from 'semantic-ui-react';

import AppContext from "./AppContext";

import app_logo from '../assets/images/app_logo.png';
import SignUpForm from './SignUpForm';

class MenuComponent extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {context => {
                        return(
                            <div>
                                <Menu color='black' inverted>
                                    <Menu.Item
                                        link
                                        name='home'
                                        onClick={() => { this.props.history.push("/"); }}
                                    >
                                        <img src={app_logo} alt="app_logo"/>
                                    </Menu.Item>

                                    <SignUpForm/>

                                </Menu>
                            </div>
                        )
                    }
                }
            </AppContext.Consumer>
        )
    }
}

export default withRouter(MenuComponent);
