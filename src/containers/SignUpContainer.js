import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import UsernameFormContainer from './UsernameFormContainer';

class SignUp extends Component {
    render() {
        return (
            <div className="valign-wrapper">
                <div className="centerDiv">
                    <h1>Sign Up</h1>
                    <p>Username: {this.props.user.username}</p>
                    <p>Account: {this.props.user.address}</p>
                    <p>OrbitDB: {this.props.orbitDB.id}</p>
                    <UsernameFormContainer/>
                </div>
            </div>
        );
    }
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    user: state.user,
    orbitDB: state.orbitDB,
    drizzleStatus: state.drizzleStatus
  }
};

const SignUpContainer = drizzleConnect(SignUp, mapStateToProps);

export default SignUpContainer;