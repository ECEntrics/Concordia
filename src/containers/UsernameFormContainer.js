import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'

import { createDatabases } from './../util/orbit'

import PropTypes from 'prop-types'

const contract = "Forum";
const signUpMethod = "signUp";
const updateUsernameMethod ="updateUsername";

class UsernameFormContainer extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.contracts = context.drizzle.contracts;
        this.state = {usernameInput:''};
    }

    async handleSubmit() {
        if(this.props.user.hasSignedUp)
           this.contracts[contract].methods[updateUsernameMethod].cacheSend(...[this.state.usernameInput]);
        else
        {
            const orbitdbInfo = await createDatabases();
            this.contracts[contract].methods[signUpMethod].cacheSend(...[this.state.usernameInput, orbitdbInfo.id,
                orbitdbInfo.topicsDB, orbitdbInfo.postsDB, orbitdbInfo.publicKey, orbitdbInfo.privateKey]);
        }

    }


    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        const hasSignedUp = this.props.user.hasSignedUp;

        if(hasSignedUp!==null) {
            const buttonText = hasSignedUp ? "Update" : "Sign Up";
            const placeholderText = hasSignedUp ? this.props.user.username : "Username";

            return(
                <form>
                    <div className="input-field">
                      <input key={"usernameInput"} name={"usernameInput"} id="usernameInput"
                        type="text" className="validate" value={this.state.usernameInput}
                        onChange={this.handleInputChange}/>
                      <label htmlFor="usernameInput">{placeholderText}</label>
                    </div>
                    <button key="submit" className="waves-effect waves-light btn-large" type="button" onClick={this.handleSubmit}>{buttonText}</button>
                </form>
            );
        }

        return(null);
    }
}

UsernameFormContainer.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts,
        user: state.user
    }
};

export default drizzleConnect(UsernameFormContainer, mapStateToProps)