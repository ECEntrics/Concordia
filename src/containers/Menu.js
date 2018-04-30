import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const contract = "Forum";
const method = "hasUserSignedUp";

class Menu extends Component {
    constructor(props, context) {
        super(props);

        this.contracts = context.drizzle.contracts;

        // Get the contract ABI
        const abi = this.contracts[contract].abi;

        // Fetch initial value from chain and return cache key for reactive updates.
        let methodArgs = this.props.methodArgs ? this.props.methodArgs : [];
        this.dataKey = this.contracts[contract].methods[method].cacheCall(...methodArgs);

        // Iterate over abi for correct function.
        for (let i = 0; i < abi.length; i++) {
            if (abi[i].name === this.props.method) {
                this.fnABI = abi[i];
                break
            }
        }
    }

    render() {
        // Contract is not yet intialized.
        if(!this.props.contracts[contract].initialized) {
            return (
                <span> </span>
            )
        }

        // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
        if(!(this.dataKey in this.props.contracts[contract][method])) {
            return (
                <span> </span>
            )
        }

        let displayData = this.props.contracts[contract][method][this.dataKey].value;

        if (displayData) {
            return(
                <span>User has signed up!</span>
            )
        }

        return(
            <span>User doesn't exist!</span>
        )
    }
}

Menu.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    }
};

export default drizzleConnect(Menu, mapStateToProps)