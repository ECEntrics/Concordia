import React, { Component } from 'react';
import { connect } from "react-redux";

import { Button, Message, Form, Dimmer, Loader, Header } from 'semantic-ui-react';

import { drizzle } from '../index';
import { createDatabases } from '../utils/orbitUtils';
import { updateUsername } from '../redux/actions/transactionsActions';

const contract = "Forum";
const checkUsernameTakenMethod = "isUserNameTaken";
const signUpMethod = "signUp";

class UsernameFormContainer extends Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.completeAction = this.completeAction.bind(this);
        this.checkedUsernames = [];

        this.state = {
            usernameInput: '',
            error: false,
            errorHeader: "",
            errorMessage: "",
            signingUp: false
        };
    }

    handleInputChange(e, { name, value }) {
        this.setState({
            [name]: value,
            error: false
        });
        if (value !== '') {
            if (this.checkedUsernames.length > 0) {
                if (this.checkedUsernames.some(e => e.usernameChecked === value)){
                    return;
                }
            }

            drizzle.contracts[contract].methods[checkUsernameTakenMethod].cacheCall(value);
        }
    }

    handleSubmit() {
        if (this.state.usernameInput === ''){
            this.setState({
                error: true,
                errorHeader: "Data Incomplete",
                errorMessage: "You need to provide a username"
            });
        } else if (!this.state.error) {
            // Makes sure current input username has been checked for availability
            if (this.checkedUsernames.some(e => e.usernameChecked === this.state.usernameInput)){
                this.completeAction();
            }
        }
    }

    async completeAction() {
        if(this.props.user.hasSignedUp){
            this.props.dispatch(updateUsername(...[this.state.usernameInput], null));
        } else {
            this.setState({ signingUp: true });
            const orbitdbInfo = await createDatabases();
            this.stackId = drizzle.contracts[contract].methods[signUpMethod]
                .cacheSend(...[this.state.usernameInput,
                    orbitdbInfo.identityId,
                    orbitdbInfo.identityPublicKey,
                    orbitdbInfo.identityPrivateKey,
                    orbitdbInfo.orbitId,
                    orbitdbInfo.orbitPublicKey,
                    orbitdbInfo.orbitPrivateKey,
                    orbitdbInfo.topicsDB,
                    orbitdbInfo.postsDB
                ], { from: this.props.account});
        }
        this.setState({ usernameInput: '' });
    }

    componentDidUpdate() {
        if (this.state.signingUp) {
            const txHash = this.props.transactionStack[this.stackId];
            if (txHash &&
                this.props.transactions[txHash] &&
                this.props.transactions[txHash].status === "error") {
                this.setState({signingUp: false});
            }
        } else {
            const temp = Object.values(this.props.contracts[contract][checkUsernameTakenMethod]);
            this.checkedUsernames = temp.map(checked => {return {
                usernameChecked: checked.args[0],
                isTaken: checked.value
            }});

            if (this.checkedUsernames.length > 0){
                this.checkedUsernames.forEach( checked => {
                    if (checked.usernameChecked === this.state.usernameInput &&
                    checked.isTaken && !this.state.error) {
                        this.setState({
                            error: true,
                            errorHeader: "Data disapproved",
                            errorMessage: "This username is already taken"
                        });
                    }
                })
            }
        }
    }

    render() {
        const hasSignedUp = this.props.user.hasSignedUp;

        if(hasSignedUp !== null) {
            const buttonText = hasSignedUp ? "Update" : "Sign Up";
            const placeholderText = hasSignedUp ? this.props.user.username : "Username";
            const withError = this.state.error && {error: true};

            /*var disableSubmit = true;
            if (this.checkedUsernames.length > 0) {
                if (this.checkedUsernames.some(e => e.usernameChecked === this.state.usernameInput)){
                    disableSubmit = false;
                }
            } else {
                disableSubmit = false;
            }

            disableSubmit = (disableSubmit || this.state.error) && {loading: true};*/

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
                    <Dimmer active={this.state.signingUp} page>
                        <Header as='h2' inverted>
                            <Loader size='large'>Magic elves are processing your noble request.</Loader>
                        </Header>
                    </Dimmer>
                </div>
            );
        }

        return(null);
    }
}

const mapStateToProps = state => {
    return {
        account: state.accounts[0],
        contracts: state.contracts,
        transactions: state.transactions,
        transactionStack: state.transactionStack,
        user: state.user
    }
};

export default connect(mapStateToProps)(UsernameFormContainer);
