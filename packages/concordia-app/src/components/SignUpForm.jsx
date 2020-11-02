import React, { Component } from 'react';
import {
  Button, Form, Menu, Message, Modal,
} from 'semantic-ui-react';

import { connect } from 'react-redux';
import AppContext from './AppContext';

const contractName = 'Forum';
const checkUsernameTakenMethod = 'isUserNameTaken';
const signUpMethod = 'signUp';

class SignUpForm extends Component {
  constructor(props, context) {
    super(props, context);

    // For quick access
    this.contract = this.context.drizzle.contracts[contractName];

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.completeAction = this.completeAction.bind(this);

    this.checkedUsernames = [];

    this.state = {
      usernameInput: '',
      error: false,
      errorHeader: '',
      errorMessage: '',
      signingUp: false,
    };
  }

  componentDidUpdate() {
    // TODO
  }

  handleSubmit() {
    const { usernameInput, error } = this.state;

    if (usernameInput === '') {
      this.setState({
        error: true,
        errorHeader: 'Data Incomplete',
        errorMessage: 'You need to provide a username',
      });
    } else if (!error) {
      // TODO
      // // Makes sure current input username has been checked for availability
      // if (this.checkedUsernames.some((e) => e.usernameChecked === usernameInput)) {
      //     this.completeAction();
      // }
      this.completeAction();
    }
  }

  handleInputChange(e, { name, value }) {
    this.setState({
      [name]: value,
      error: false,
    });
    if (value !== '') {
      if (this.checkedUsernames.length > 0) {
        if (this.checkedUsernames.some((e) => e.usernameChecked === value)) {
          return;
        }
      }

      this.contract.methods[checkUsernameTakenMethod].cacheCall(
        value,
      );
    }
  }

  completeAction() {
    const { usernameInput } = this.state;
    const { user, account } = this.props;

    if (user.hasSignedUp) {
      console.log('Signing up..');
      this.contract.methods.signUp.cacheSend(usernameInput);
    } else {
      this.setState({
        signingUp: true,
      });
      this.contract.methods[signUpMethod].cacheSend(
        ...[usernameInput], { from: account },
      );
    }
    this.setState({
      usernameInput: '',
    });
  }

  render() {
    const {
      error, usernameInput, errorHeader, errorMessage, signingUp,
    } = this.state;

    return (
        <Modal
          as={Form}
          onSubmit={(e) => this.handleSubmit(e)}
          trigger={(
              <Menu.Item
                name="signup"
                position="right"
                content="Sign Up"
              />
          )}
        >
            <Modal.Header>Sign Up</Modal.Header>
            <Modal.Content>

                <Form.Field required>
                    <label>Username</label>
                    <Form.Input
                      placeholder="Username"
                      name="usernameInput"
                      value={usernameInput}
                      onChange={this.handleInputChange}
                    />
                </Form.Field>
                <Message
                  error
                  header={errorHeader}
                  content={errorMessage}
                />
                <Button type="submit" color="black" content="Sign Up" />

            </Modal.Content>
        </Modal>
    );
  }
}

SignUpForm.contextType = AppContext.Context;

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(SignUpForm);
