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
            const orbitdb = await createDatabases();
            this.contracts[contract].methods[signUpMethod].cacheSend(...[this.state.usernameInput, orbitdb.mainDB, orbitdb.topicsDB, orbitdb.postsDB]);
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
                <form className="pure-form pure-form-stacked">
                    <input key={"usernameInput"} name={"usernameInput"} type="text" value={this.state.usernameInput} placeholder={placeholderText} onChange={this.handleInputChange} />
                    <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>{buttonText}</button>
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