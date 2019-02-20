import React from 'react'
import {connect} from 'react-redux';
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
            render={props =>
                props.hasSignedUp ? (
                    <Component {...props} />
                ) : (
                <Redirect to={{
                    pathname: "/signup",
                    state: { from: props.location }
                }}
                />
                )
            }
    />
);

const mapStateToProps = state => {
    return {
        hasSignedUp: state.user.hasSignedUp,
    }
};

export default connect(mapStateToProps)(PrivateRoute);
