import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AuthWrapperContainer from './AuthWrapperContainer'

const contract = "Forum";
const signUpMethod = "signUp";
const updateUsernameMethod ="updateUsername";

class UsernameFormContainer extends Component {
    constructor(props, context) {
        super(props);

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignUpInputChange = this.handleSignUpInputChange.bind(this);

        this.handleUsernameUpdate = this.handleUsernameUpdate.bind(this);
        this.handleUpdateUsernameInputChange = this.handleUpdateUsernameInputChange.bind(this);

        this.contracts = context.drizzle.contracts;

        // Get the contract ABI
        const abi = this.contracts[contract].abi;


        this.inputs = {signUp:[], updateUsername:[]};
        let initialState = {signUp:{}, updateUsername:{}};

        // Iterate over abi for correct function.
        for (let i = 0; i < abi.length; i++) {
            if ((abi[i].name === signUpMethod)) {
                this.inputs.signUp = abi[i].inputs;

                for (let i = 0; i < this.inputs.signUp.length; i++) {
                    initialState.signUp[this.inputs.signUp[i].name] = '';
                }

            }
            else if ((abi[i].name === updateUsernameMethod)) {
                this.inputs.updateUsername = abi[i].inputs;

                for (let i = 0; i < this.inputs.updateUsername.length; i++) {
                    initialState.updateUsername[this.inputs.updateUsername[i].name] = '';
                }

            }
        }
        console.dir(initialState);
        this.state = initialState;
    }

    handleSignUp() {
        this.contracts[contract].methods[signUpMethod].cacheSend(...Object.values(this.state.signUp));
    }

    handleUsernameUpdate() {
        this.contracts[contract].methods[updateUsernameMethod].cacheSend(...Object.values(this.state.updateUsername));
    }

    handleSignUpInputChange(event) {
        this.setState({ signUp: { ...this.state.signUp, [event.target.name]: event.target.value} });
    }

    handleUpdateUsernameInputChange(event) {
        this.setState({ updateUsername: { ...this.state.updateUsername, [event.target.name]: event.target.value} });
    }


    render() {
        let signUp = this.inputs.signUp[0].name;    //username
        let updateUsername = this.inputs.updateUsername[0].name;    //newUsername
        return (
            <AuthWrapperContainer
                authRender={
                    <form className="pure-form pure-form-stacked">
                        <input key={updateUsername} name={updateUsername} type="text" value={this.state.updateUsername.newUsername} placeholder="Username" onChange={this.handleUpdateUsernameInputChange} />
                        <button key="submit" className="pure-button" type="button" onClick={this.handleUsernameUpdate}>Update</button>
                    </form>
                }
                guestRender={
                    <form className="pure-form pure-form-stacked">
                        <input key={signUp} name={signUp} type="text" value={this.state.signUp.username} placeholder="Username" onChange={this.handleSignUpInputChange} />
                        <button key="submit" className="pure-button" type="button" onClick={this.handleSignUp}>Sign Up</button>
                    </form>
                }
            />


        )
    }
}

UsernameFormContainer.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    }
};

export default drizzleConnect(UsernameFormContainer, mapStateToProps)