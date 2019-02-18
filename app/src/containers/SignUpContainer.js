import React, { Component } from 'react';

import { Header } from 'semantic-ui-react';
import {bindActionCreators} from "redux";
import {push} from "connected-react-router";
import {connect} from "react-redux";

class SignUp extends Component {
    render() {
        return (
            this.props.user.hasSignedUp
                ?(<div className="vertical-center-in-parent">
                    <Header color='teal' textAlign='center' as='h2'>
                        There is already an account for this addresss.
                    </Header>
                    <Header color='teal' textAlign='center' as='h4'>
                        If you want to create another account please change your address.
                    </Header>
                </div>)
                :(<div className="sign-up-container">
                    <div>
                        <h1>Sign Up</h1>
                        <p className="no-margin">
                            <strong>Account address:</strong> {this.props.user.address}
                        </p>
                        UsernameFormContainer
                    </div>
                </div>)
        );
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    navigateTo: () => push()
}, dispatch);


const mapStateToProps = state => {
    return {
        user: state.user
    }
};

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUpContainer;

