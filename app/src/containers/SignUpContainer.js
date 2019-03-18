import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UsernameFormContainer from './UsernameFormContainer';

class SignUpContainer extends Component {
  componentDidUpdate(prevProps) {
    const { user, history } = this.props;
    if (user.hasSignedUp && !prevProps.user.hasSignedUp) history.push('/');
  }

  render() {
    const { user } = this.props;

    return (
      user.hasSignedUp
        ? (
          <div className="vertical-center-in-parent">
            <Header color="teal" textAlign="center" as="h2">
                There is already an account for this addresss.
            </Header>
            <Header color="teal" textAlign="center" as="h4">
                If you want to create another account please change your address.
            </Header>
          </div>
        )
        : (
          <div className="sign-up-container">
            <div>
              <h1>Sign Up</h1>
              <p className="no-margin">
                <strong>Account address:</strong>
                {' '}
                {user.address}
              </p>
              <UsernameFormContainer />
            </div>
          </div>
        )
    );
  }
}

SignUpContainer.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(SignUpContainer);
