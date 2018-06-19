import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Message } from 'semantic-ui-react';

import { updateTransaction } from '../redux/actions/transactionsMonitorActions';

class RightSideBar extends Component {
    constructor(props, context) {
        super(props);

        this.handleMessageDismiss = this.handleMessageDismiss.bind(this);
        this.updateTransactions = this.updateTransactions.bind(this);
        this.completeWithOrbitInteractions = this.completeWithOrbitInteractions.bind(this);

        this.drizzle = context.drizzle;
        this.transactionsStackIds = [];
        this.transactionsTxHashes = [];

        this.state = {
            transactionsCompletionTime: [],
            isTransactionMessageActive: []
        }
    }

    handleMessageDismiss(messageIndex) {
        let isTransactionMessageActiveShallowCopy = this.state.isTransactionMessageActive.slice();
        isTransactionMessageActiveShallowCopy[messageIndex] = false;
        this.setState({
            isTransactionMessageActive: isTransactionMessageActiveShallowCopy
        });
    }

    render() {
        let transactionMessages = this.props.transactionsQueue.map((transaction, index) => {
            if (!this.state.isTransactionMessageActive[index]){
                return null;
            }
            let color = 'black';
            let message = [];

            while(true) {
                if (transaction.status === 'initialized') break;
                message.push("New transaction has been queued and is waiting your confirmation.");

                if (transaction.status === 'acceptance_pending') break;
                message.push(<br key="confirmed"/>);
                message.push("- transaction confirmed");

                if (transaction.status === 'mining_pending') break;
                message.push(<br key="mined"/>);
                message.push("- transaction mined");

                if (transaction.status === 'success') {
                    color = 'green';
                    message.push(<br key="success"/>);
                    message.push("- transaction completed successfully");
                    break;
                }
                if (transaction.status === 'error') {
                    color = 'red';
                    message.push(<br key="fail"/>);
                    message.push("Transaction failed to complete!");
                    break;
                }
            }

            return (
                    <div className="sidebar-message" key={index}>
                        <Message color={color} onDismiss={() => {this.handleMessageDismiss(index)}}>
                            {message}
                        </Message>
                    </div>
            );
        });

        return (transactionMessages);
    }

    componentDidUpdate(){ //Maybe change to componentWillReceiveProps()
        this.updateTransactions();
    }

    updateTransactions(){
        for (var index = 0; index < this.props.transactionsQueue.length; ++index) {
            let transaction = this.props.transactionsQueue[index];

            if (transaction.status === 'initialized' &&
                this.transactionsStackIds[index] === undefined){
                /*      User submitted a new transaction       */

                let isTransactionMessageActiveShallowCopy = this.state
                    .isTransactionMessageActive.slice();
                isTransactionMessageActiveShallowCopy[index] = true;
                this.setState({
                    isTransactionMessageActive: isTransactionMessageActiveShallowCopy
                });

                this.transactionsStackIds[index] = (this.drizzle
                    .contracts[transaction.contract]
                    .methods[transaction.method]
                    .cacheSend(...(transaction.params)));
                this.props.store.dispatch(updateTransaction(index, {
                    status: 'acceptance_pending'
                }));
            } else if (transaction.status === 'acceptance_pending'){
                if (this.props.transactionStack[this.transactionsStackIds[index]]){
                    /*      User confirmed the transaction       */

                    //Gets transaction's hash
                    this.transactionsTxHashes[index] = (this.props
                        .transactionStack[this.transactionsStackIds[index]]);
                    this.props.store.dispatch(updateTransaction(index, {
                        status: 'mining_pending'
                    }));
                }
            } else if (transaction.status === 'mining_pending'){
                if (this.props.transactions[this.transactionsTxHashes[index]]
                    .status === "success"){
                    /*      Transaction completed successfully      */

                    //Gets returned data by contract
                    let data = this.props.transactions[this.transactionsTxHashes[index]]
                        .receipt.events[transaction.event].returnValues;

                    this.props.store.dispatch(updateTransaction(index, {
                        status: 'success',
                        returnData: data
                    }));

                    let transactionsCompletionTimeShallowCopy = this.state
                        .transactionsCompletionTime.slice();
                    transactionsCompletionTimeShallowCopy[index] = new Date().getTime();
                    this.setState({
                        transactionsCompletionTime: transactionsCompletionTimeShallowCopy
                    });

                    this.completeWithOrbitInteractions(this.props.transactionsQueue[index], data);
                } else if (this.props.transactions[this.transactionsTxHashes[index]]
                    .status === "error"){
                    /*      Transaction failed to complete      */

                    this.props.store.dispatch(updateTransaction(index, {
                        status: 'error'
                    }));

                    let transactionsCompletionTimeShallowCopy = this.state
                        .transactionsCompletionTime.slice();
                    transactionsCompletionTimeShallowCopy[index] = new Date().getTime();
                    this.setState({
                        transactionsCompletionTime: transactionsCompletionTimeShallowCopy
                    });
                    //TODO handle this gracefully
                }
            }
        }
    }

    async completeWithOrbitInteractions(transaction, returnData){
        switch (transaction.event){
            case 'TopicCreated':
                await this.props.orbitDB.topicsDB.put(returnData.topicID, {
                    subject: transaction.userInputs.topicSubject
                });

                await this.props.orbitDB.postsDB.put(returnData.postID, {
                    subject: transaction.userInputs.topicSubject,
                    content: transaction.userInputs.topicMessage
                });
                break;
            case 'PostCreated':
                await this.props.orbitDB.postsDB.put(returnData.postID, {
                    subject: transaction.userInputs.postSubject,
                    content: transaction.userInputs.postMessage
                });
                break;
            default:
                break; //This transaction doesn't need a DB interaction to complete
        }
    }
}

RightSideBar.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        orbitDB: state.orbitDB,
        transactionsQueue: state.transactionsQueue.transactions,
        transactions: state.transactions,
        transactionStack: state.transactionStack
    }
};

const RightSideBarContainer = drizzleConnect(RightSideBar, mapStateToProps);

export default RightSideBarContainer;