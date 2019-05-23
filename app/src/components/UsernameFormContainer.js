import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Dimmer, Form, Header, Loader, Message } from 'semantic-ui-react';

import { drizzle } from '../index';
import { updateUsername } from '../redux/actions/transactionsActions';

const contract = 'Forum';
const checkUsernameTakenMethod = 'isUserNameTaken';
const signUpMethod = 'signUp';

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
      errorHeader: '',
      errorMessage: '',
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
        if (this.checkedUsernames.some(e => e.usernameChecked === value)) {
          return;
        }
      }

      drizzle.contracts[contract].methods[checkUsernameTakenMethod].cacheCall(
        value,
      );
    }
  }

  handleSubmit() {
    const { usernameInput, error } = this.state;

    if (usernameInput === '') {
      this.setState({
        error: true,
        errorHeader: 'Data Incomplete',
        errorMessage: 'You need to provide a username'
      });
    } else if (!error) {
      // Makes sure current input username has been checked for availability
      if (this.checkedUsernames.some(
        e => e.usernameChecked === usernameInput,
      )) {
        this.completeAction();
      }
    }
  }

  async completeAction() {
    const { usernameInput } = this.state;
    const { user, dispatch, account } = this.props;

    if (user.hasSignedUp) {
      dispatch(updateUsername(...[usernameInput], null));
    } else {
      this.setState({
        signingUp: true
      });
      this.stackId = drizzle.contracts[contract].methods[signUpMethod].cacheSend(
        ...[usernameInput], { from: account }
      );
    }
    this.setState({
      usernameInput: ''
    });
  }

  componentDidUpdate() {
    const { signingUp, usernameInput, error } = this.state;
    const { transactionStack, transactions, contracts } = this.props;

    if (signingUp) {
      const txHash = transactionStack[this.stackId];
      if (txHash
          && transactions[txHash]
          && transactions[txHash].status === 'error') {
        this.setState({
          signingUp: false
        });
      }
    } else {
      const temp = Object.values(
        contracts[contract][checkUsernameTakenMethod],
      );
      this.checkedUsernames = temp.map(checked => ({
        usernameChecked: checked.args[0],
        isTaken: checked.value
      }));

      if (this.checkedUsernames.length > 0) {
        this.checkedUsernames.forEach((checked) => {
          if (checked.usernameChecked === usernameInput
              && checked.isTaken && !error) {
            this.setState({
              error: true,
              errorHeader: 'Data disapproved',
              errorMessage: 'This username is already taken'
            });
          }
        });
      }
    }
  }

  render() {
    const { error, usernameInput, errorHeader, errorMessage, signingUp } = this.state;
    const { user } = this.props;

    if (user.hasSignedUp !== null) {
      const buttonText = user.hasSignedUp ? 'Update' : 'Sign Up';
      const placeholderText = user.hasSignedUp
        ? user.username
        : 'Username';
      const withError = error && {
        error: true
      };

      /* var disableSubmit = true;
      if (this.checkedUsernames.length > 0) {
          if (this.checkedUsernames.some(e => e.usernameChecked === this.state.usernameInput)){
              disableSubmit = false;
          }
      } else {
          disableSubmit = false;
      }

      disableSubmit = (disableSubmit || this.state.error) && {loading: true}; */

      return (
        <div>
          <Form onSubmit={this.handleSubmit} {...withError}>
            <Form.Field required>
              <label>Username</label>
              <Form.Input
                placeholder={placeholderText}
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
            <Button type="submit">{buttonText}</Button>
          </Form>
          <Dimmer active={signingUp} page>
            <Header as="h2" inverted>
              <Loader size="large">
Magic elves are processing your noble
                  request.
              </Loader>
            </Header>
          </Dimmer>
        </div>
      );
    }

    return (null);
  }
}

UsernameFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  transactionStack: PropTypes.array.isRequired,
  transactions: PropTypes.PropTypes.objectOf(PropTypes.object).isRequired,
  contracts: PropTypes.PropTypes.objectOf(PropTypes.object).isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  account: state.accounts[0],
  contracts: state.contracts,
  transactions: state.transactions,
  transactionStack: state.transactionStack,
  user: state.user
});

export default connect(mapStateToProps)(UsernameFormContainer);
