import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { Message } from 'semantic-ui-react';

class RightSideBar extends Component {
    constructor(props, context) {
        super(props);

        this.handleMessageClick = this.handleMessageClick.bind(this);
        this.handleMessageDismiss = this.handleMessageDismiss.bind(this);

        this.state = {
            isTransactionMessageDismissed: []
        }
    }

    handleMessageClick(index) {
        let transactionHash = this.props.transactionStack[index];
        if (this.props.transactions[transactionHash]) {
            if (this.props.transactions[transactionHash].status === 'error') {
                this.handleMessageDismiss(null, index);
            } else {
                if (this.props.transactions[transactionHash].receipt &&
                    this.props.transactions[transactionHash].receipt.events) {
                    switch (Object.keys(this.props.transactions[transactionHash].receipt.events)[0]){
                        case 'UserSignedUp':
                            this.props.history.push("/profile");
                            this.handleMessageDismiss(null, index);
                            break;
                        case 'TopicCreated':
                            this.props.history.push("/topic/" +
                                this.props.transactions[transactionHash].receipt.events.TopicCreated.returnValues.topicID
                            );
                            this.handleMessageDismiss(null, index);
                            break;
                        default:
                            this.handleMessageDismiss(null, index);
                            break;
                    }
                }
            }
        }
    }

    handleMessageDismiss(event, messageIndex) {
        if (event !== null) {
            event.stopPropagation();
        }

        let isTransactionMessageDismissedShallowCopy = this.state.isTransactionMessageDismissed.slice();
        isTransactionMessageDismissedShallowCopy[messageIndex] = true;
        this.setState({
            isTransactionMessageDismissed: isTransactionMessageDismissedShallowCopy
        });
    }

    render() {
        if (this.props.transactionStack.length === 0){
            return null;
        }

        let transactionMessages = this.props.transactionStack.map((transaction, index) => {
            if (this.state.isTransactionMessageDismissed[index]){
                return null;
            }

            let color = 'black';
            let message = [];
            message.push("New transaction has been queued and is waiting your confirmation.");
            if (this.props.transactions[transaction]) {
                message.push(<br key="confirmed"/>);
                message.push("- transaction confirmed");
            }
            if (this.props.transactions[transaction] &&
                this.props.transactions[transaction].status === 'success') {
                /*      Transaction completed successfully      */
                message.push(<br key="mined"/>);
                message.push("- transaction mined");
                color = 'green';
                message.push(<br key="success"/>);
                message.push("- transaction completed successfully");
            } else if (this.props.transactions[transaction] &&
                this.props.transactions[transaction].status === "error"){
                /*      Transaction failed to complete      */
                message.push(<br key="mined"/>);
                message.push("- transaction mined");
                color = 'red';
                message.push(<br key="fail"/>);
                message.push("Transaction failed to complete!");
            }

            return (
                <div className="sidebar-message" key={index}
                    onClick={() => {this.handleMessageClick(index)}} >
                    <Message color={color}
                        onDismiss={(e) => {this.handleMessageDismiss(e, index)}}>
                        {message}
                    </Message>
                </div>
            );
        });

        return (transactionMessages);
    }
}

const mapStateToProps = state => {
    return {
        transactions: state.transactions,
        transactionStack: state.transactionStack
    }
};

const RightSideBarContainer = withRouter(connect(mapStateToProps)(RightSideBar));

export default RightSideBarContainer;