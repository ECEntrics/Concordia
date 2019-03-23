import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (props.hasSignedUp ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/signup',
        state: {
          from: props.location
        }
      }}
      />
    ))
        }
  />
);

const mapStateToProps = state => ({
  hasSignedUp: state.user.hasSignedUp
});

export default connect(mapStateToProps)(PrivateRoute);
