import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Button, Message, Form, Dimmer, Loader, Header } from 'semantic-ui-react';
import { createDatabases } from './../util/orbit';

const contract = "Forum";
const signUpMethod = "signUp";
const updateUsernameMethod ="updateUsername";

class UsernameFormContainer extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.completeAction = this.completeAction.bind(this);

        this.contracts = context.drizzle.contracts;

        this.state = {
            usernameInput: '',
            error: false,
            completingAction: false
        };
    }

    handleInputChange(e, { name, value }) {
        this.setState({ [name]: value })
    }

    handleSubmit() {
        if (this.state.usernameInput === ''){
            this.setState({ error: true });
        } else {
            this.completeAction();
        }
    }

    async completeAction() {
        this.setState({ completingAction: true });
        if(this.props.user.hasSignedUp)
           this.contracts[contract].methods[updateUsernameMethod].cacheSend(...[this.state.usernameInput]);
        else
        {
            const orbitdbInfo = await createDatabases();
            this.contracts[contract].methods[signUpMethod].cacheSend(...[this.state.usernameInput, orbitdbInfo.id,
                orbitdbInfo.topicsDB, orbitdbInfo.postsDB, orbitdbInfo.publicKey, orbitdbInfo.privateKey]);
        }
    }

    render() {
        const hasSignedUp = this.props.user.hasSignedUp;

        if(hasSignedUp !== null) {
            const buttonText = hasSignedUp ? "Update" : "Sign Up";
            const placeholderText = hasSignedUp ? this.props.user.username : "Username";
            var withError = this.state.error && {error: true};

            return(
                <div>
                    <Form onSubmit={this.handleSubmit} {...withError}>
                        <Form.Field required>
                            <label>Username</label>
                            <Form.Input
                                placeholder={placeholderText}
                                name='usernameInput'
                                value={this.state.usernameInput}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                        <Message
                            error
                            header='Data Incomplete'
                            content='You need to provide a username to sign up for an account.'
                        />
                        <Button type='submit'>{buttonText}</Button>
                    </Form>
                    <Dimmer active={this.state.completingAction} page>
                        <Header as='h2' inverted>
                            <Loader size='large'>Magic elfs are processing your nobel request.</Loader>
                        </Header>
                    </Dimmer>
                </div>
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