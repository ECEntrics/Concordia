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

        this.drizzle = context.drizzle;
        this.dataKeys = [];
        let blockchainData = this.callsInfo.map((call) => {
            return ({
                callInfo: call,
                status: "initialized",
                returnData: null
            });
        });

        //Initial call
        for (var i = 0; i < this.callsInfo.length; ++i){
            this.dataKeys[i] = this.drizzle
                .contracts[this.callsInfo[i].contract]
                .methods[this.callsInfo[i].method]
                .cacheCall(...(this.callsInfo[i].params));
            blockchainData[i].status = "pending";
        }

        this.state = {
            callState: new Array(this.callsInfo.length).fill("pending"),
            blockchainData: blockchainData
        }
    }

    render() {
        let {component, callsInfo, ...rest } = this.props; //Update rest arguments
        return (
            <this.component blockchainData={this.state.blockchainData} {...rest}/>
        );
    }

    componentWillUpdate(){
        let currentDrizzleState = this.drizzle.store.getState();
        for (var i = 0; i < this.callsInfo.length; ++i){
            let dataFetched = (currentDrizzleState
                .contracts[this.callsInfo[i].contract][this.callsInfo[i].method][this.dataKeys[i]]);
            if (dataFetched && dataFetched.value !== this.state.blockchainData[i].returnData){
                /* There are new data in the blockchain*/

                //Immutable update
                let newBlockchainData = this.state.blockchainData.map((callData, index) => {
                    if (index !== i) return callData;
                    return {
                        ...callData,
                        returnData: dataFetched.value,
                        status: "success"
                    }
                })

                let newStates = this.state.callState.slice();
                newStates[i] = "success"
                this.setState({
                    callState: newStates,
                    blockchainData: newBlockchainData
                });
            }
        }
    }
}

WithBlockchainData.contextTypes = {
    drizzle: PropTypes.object
};

export default WithBlockchainData;