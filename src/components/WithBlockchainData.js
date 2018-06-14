import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WithBlockchainData extends Component {
    constructor(props, context) {
        super(props);

        {
            let {component, callsInfo, ...rest } = this.props;
            this.component = component;
            this.callsInfo = callsInfo;
            this.forwardedProps = rest;
        }

        this.checkContractUpdates = this.checkContractUpdates.bind(this);

        this.drizzle = context.drizzle;
        this.dataKeys = [];
        this.blockchainData = this.callsInfo.map((call) => {
            return ({
                callInfo: call,
                status: "initialized",
                returnData: null
            });
        });

        for (var i = 0; i < this.callsInfo.length; ++i){
            this.dataKeys[i] = this.drizzle
                .contracts[this.callsInfo[i].contract]
                .methods[this.callsInfo[i].method]
                .cacheCall(...(this.callsInfo[i].params));
            this.blockchainData[i].status = "pending";
        }

        this.state = {
            transactionsState: new Array(this.callsInfo.length).fill("pending")
        }
    }

    render() {
        let {component, callsInfo, ...rest } = this.props;
        return (
            <this.component blockchainData={this.blockchainData} {...rest}/>
        );
    }

    componentDidMount() {
        this.intervalChecker = setInterval(this.checkContractUpdates, 10); //HOWMUCHMUCHACHO???
    }

    componentWillUnmount() {
        clearInterval(this.intervalChecker);
    }

    checkContractUpdates() {
        for (var i = 0; i < this.callsInfo.length; ++i){
            let currentDrizzleState = this.drizzle.store.getState();
            if (this.state.transactionsState[i] === "pending") {
                let dataFetched = (currentDrizzleState
                    .contracts[this.callsInfo[i].contract][this.callsInfo[i].method][this.dataKeys[i]]);
                if (dataFetched){
                    this.blockchainData[i].returnData = dataFetched.value;
                    this.blockchainData[i].status = "success";
                    this.setState((prevState) => ({
                        transactionsState: [
                            ...prevState.transactionsState.slice(0, i),
                            "success",
                            ...prevState.transactionsState.slice(i)
                        ]
                    }));
                }
            } //TODO cover errors!!
        }
    }
}

WithBlockchainData.contextTypes = {
    drizzle: PropTypes.object
};

export default WithBlockchainData;