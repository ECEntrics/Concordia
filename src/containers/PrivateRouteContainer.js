import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const PrivateRoute = ({ component, redirectTo, user, ...rest }) => {
  console.log("rest");
  console.log(JSON.stringify(component));
  return (
    <Route
      {...rest} render={routeProps => {
        return user.hasSignedUp
        ? (renderMergedProps(component, routeProps, rest))
        : (<Redirect
            to={{
              pathname: redirectTo,
              state: { from: routeProps.location }
            }}
          />);
    }}/>
  );
};

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}


const PrivateRouteContainer = withRouter(connect(state => ({
  hasSignedUp: state.user.hasSignedUp
}))(PrivateRoute));

/*const mapStateToProps = state => {
  return {
    user: state.user
  }
};*/

/*const PrivateRouteContainer = withRouter(drizzleConnect(PrivateRoute, mapStateToProps));*/

export default PrivateRouteContainer;