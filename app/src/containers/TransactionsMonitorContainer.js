import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Message } from 'semantic-ui-react';

class RightSideBar extends Component {
  constructor(props) {
    super(props);

    this.handleMessageClick = this.handleMessageClick.bind(this);
    this.handleMessageDismiss = this.handleMessageDismiss.bind(this);

    this.state = {
      isTransactionMessageDismissed: []
    };
  }

  handleMessageClick(index) {
    const { transactionStack, history, transactions } = this.props;

    const transactionHash = transactionStack[index];
    if (transactions[transactionHash]) {
      if (transactions[transactionHash].status === 'error') {
        this.handleMessageDismiss(null, index);
      } else if (transactions[transactionHash].receipt
            && transactions[transactionHash].receipt.events) {
        switch (Object.keys(
          transactions[transactionHash].receipt.events,
        )[0]) {
          case 'UserSignedUp':
            history.push('/profile');
            this.handleMessageDismiss(null, index);
            break;
          case 'UsernameUpdated':
            history.push('/profile');
            this.handleMessageDismiss(null, index);
            break;
          case 'TopicCreated':
            history.push(`/topic/${
              transactions[transactionHash].receipt.events.TopicCreated.returnValues.topicID}`);
            this.handleMessageDismiss(null, index);
            break;
          case 'PostCreated':
            history.push(`/topic/${
              transactions[transactionHash].receipt.events.PostCreated.returnValues.topicID
            }/${
              transactions[transactionHash].receipt.events.PostCreated.returnValues.postID}`);
            this.handleMessageDismiss(null, index);
            break;
          default:
            this.handleMessageDismiss(null, index);
            break;
        }
      }
    }
  }

  handleMessageDismiss(event, messageIndex) {
    if (event !== null) {
      event.stopPropagation();
    }

    const { isTransactionMessageDismissed } = this.state;

    const isTransactionMessageDismissedShallowCopy = isTransactionMessageDismissed.slice();
    isTransactionMessageDismissedShallowCopy[messageIndex] = true;
    this.setState({
      isTransactionMessageDismissed: isTransactionMessageDismissedShallowCopy
    });
  }

  render() {
    const { isTransactionMessageDismissed } = this.state;
    const { transactionStack, transactions } = this.props;

    if (transactionStack.length === 0) {
      return null;
    }

    const transactionMessages = transactionStack.map(
      (transaction, index) => {
        if (isTransactionMessageDismissed[index]) {
          return null;
        }

        let color = 'black';
        const message = [];
        message.push(
          'New transaction has been queued and is waiting your confirmation.',
        );
        if (transactions[transaction]) {
          message.push(<br key="confirmed" />);
          message.push('- transaction confirmed');
        }
        if (transactions[transaction]
              && transactions[transaction].status === 'success') {
          /*      Transaction completed successfully      */
          message.push(<br key="mined" />);
          message.push('- transaction mined');
          color = 'green';
          message.push(<br key="success" />);
          message.push('- transaction completed successfully');
        } else if (transactions[transaction]
              && transactions[transaction].status === 'error') {
          /*      Transaction failed to complete      */
          message.push(<br key="mined" />);
          message.push('- transaction mined');
          color = 'red';
          message.push(<br key="fail" />);
          message.push('Transaction failed to complete!');
        }

        return (
          <div
            className="sidebar-message"
            key={index}
            onClick={() => { this.handleMessageClick(index); }}
          >
            <Message
              color={color}
              onDismiss={(e) => {
                this.handleMessageDismiss(e, index);
              }}
            >
              {message}
            </Message>
          </div>
        );
      },
    );

    return (transactionMessages);
  }
}

RightSideBar.propTypes = {
  transactionStack: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  transactions: PropTypes.PropTypes.objectOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
  transactions: state.transactions,
  transactionStack: state.transactionStack
});

const RightSideBarContainer = withRouter(
  connect(mapStateToProps)(RightSideBar),
);

export default RightSideBarContainer;
