import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Button, Message, Form, Dimmer, Loader, Header } from 'semantic-ui-react';

import { createDatabases } from './../util/orbit';
import { updateUsername } from '../redux/actions/transactionsMonitorActions';

const contract = "Forum";
const checkUsernameTakenMethod = "isUserNameTaken";
const signUpMethod = "signUp";

class UsernameFormContainer extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.completeAction = this.completeAction.bind(this);

        this.drizzle = context.drizzle;
        this.contracts = this.drizzle.contracts;

        this.state = {
            usernameInput: '',
            error: false,
            errorHeader: "",
            errorMessage: "",
            signingUp: false
        };
    }

    handleInputChange(e, { name, value }) {
        this.setState({ [name]: value })
    }

    handleSubmit() {
        if (this.state.usernameInput === ''){
            this.setState({
                error: true,
                errorHeader: "Data Incomplete",
                errorMessage: "You need to provide a username"
            });
        } else {
            this.checkUsernameTakenDataKey = this.contracts[contract].methods[checkUsernameTakenMethod]
                .cacheCall(this.state.usernameInput);
            this.setState({
                error: false
            });
            this.checkingUsernameTaken = true;
        }
    }

    async completeAction() {
        if(this.props.user.hasSignedUp){
            this.props.store.dispatch(updateUsername(...[this.state.usernameInput], null));
        } else {
            this.setState({ signingUp: true });
            const orbitdbInfo = await createDatabases();
            this.contracts[contract].methods[signUpMethod]
                .cacheSend(...[this.state.usernameInput,
                    orbitdbInfo.id,
                    orbitdbInfo.topicsDB,
                    orbitdbInfo.postsDB,
                    orbitdbInfo.publicKey,
                    orbitdbInfo.privateKey
                ]);
        }
        this.setState({ usernameInput: '' });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.signingUp && nextProps.user.hasSignedUp){
            this.props.signedUp();
        }
    }

    componentWillUpdate() {
        if (this.checkingUsernameTaken){
            let dataFetched = this.drizzle.store.getState()
                .contracts[contract][checkUsernameTakenMethod][this.checkUsernameTakenDataKey];
            if (dataFetched){
                this.checkingUsernameTaken = false;
                if (dataFetched.value){
                    this.setState({
                        error: true,
                        errorHeader: "Data disapproved",
                        errorMessage: "This username is already taken"
                    });
                } else {
                    this.setState({
                        error: false
                    });
                    this.completeAction();
                }
            }
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
                            header={this.state.errorHeader}
                            content={this.state.errorMessage}
                        />
                        <Button type='submit'>{buttonText}</Button>
                    </Form>
                    <Dimmer active={this.state.signingUp || this.checkingUsernameTaken} page>
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
        user: state.user
    }
};

export default drizzleConnect(UsernameFormContainer, mapStateToProps)