import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Route } from "react-router";
import { Redirect } from "react-router-dom";

const PrivateRoute = (props) => {
  return (
    props.user.hasSignedUp
    ? <Route path={props.path} component={props.component} />
    : <Redirect 
          from={props.path}
          to="/login"
    />
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  }
};

const PrivateRouteContainer = drizzleConnect(PrivateRoute, mapStateToProps);

export default PrivateRouteContainer;