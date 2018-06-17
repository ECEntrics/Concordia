import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import UsernameFormContainer from './UsernameFormContainer';

class SignUp extends Component {
    render() {
        return (
            <div className="sign-up-container">
                <div>
                    <h1>Sign Up</h1>
                    <p className="no-margin">
                        <strong>Account address:</strong> {this.props.user.address}
                    </p>
                    <UsernameFormContainer/>
                </div>
            </div>
        );
    }
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    user: state.user
  }
};

const SignUpContainer = drizzleConnect(SignUp, mapStateToProps);

export default SignUpContainer;