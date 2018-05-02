import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const contract = "Forum";
const method = "hasUserSignedUp";

class AuthWrapperContainer extends Component {
    constructor(props, context) {
        super(props);

        this.contracts = context.drizzle.contracts;

        this.dataKey = this.contracts[contract].methods[method].cacheCall(...[this.props.accounts[0]]);
    }

    render() {
        // Contract is not yet intialized.
        if(!this.props.contracts[contract].initialized)
            return (null);

        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if(!(this.dataKey in this.props.contracts[contract][method]))
            return (null);

        let userHasSignedUp = this.props.contracts[contract][method][this.dataKey].value;
        const authRender = this.props.authRender;
        const guestRender = this.props.guestRender;

        if (userHasSignedUp)
            return(<div>{authRender}</div>);

        return(<div>{guestRender}</div>);
    }
}

AuthWrapperContainer.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        contracts: state.contracts,
    }
};

export default drizzleConnect(AuthWrapperContainer, mapStateToProps)