import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Header } from 'semantic-ui-react';
import { drizzle } from '../index';

import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';

/* import { showProgressBar, hideProgressBar } from '../redux/actions/userInterfaceActions'; */

const contract = 'Forum';
const getNumberOfTopicsMethod = 'getNumberOfTopics';

class BoardContainer extends Component {
  constructor(props) {
    super(props);

    /* this.props.store.dispatch(showProgressBar()); */

    this.getBlockchainData = this.getBlockchainData.bind(this);
    this.handleCreateTopicClick = this.handleCreateTopicClick.bind(this);

    this.state = {
      pageStatus: 'initialized'
    };
  }

  getBlockchainData() {
    if (this.state.pageStatus === 'initialized'
        && this.props.drizzleStatus.initialized) {
      this.dataKey = drizzle.contracts[contract].methods[getNumberOfTopicsMethod].cacheCall();
      this.setState({
        pageStatus: 'loading'
      });
    }
    if (this.state.pageStatus === 'loading'
        && this.props.contracts[contract][getNumberOfTopicsMethod][this.dataKey]) {
      this.setState({
        pageStatus: 'loaded'
      });
      /* this.props.store.dispatch(hideProgressBar()); */
    }
  }

  handleCreateTopicClick() {
    this.props.history.push('/startTopic');
  }

  render() {
    let boardContents;
    if (this.state.pageStatus === 'loaded') {
      const numberOfTopics = this.props.contracts[contract][getNumberOfTopicsMethod][this.dataKey].value;

      if (numberOfTopics !== '0') {
        this.topicIDs = [];
        for (let i = 0; i < numberOfTopics; i++) {
          this.topicIDs.push(i);
        }
        boardContents = ([
          <TopicList topicIDs={this.topicIDs} key="topicList" />,
          <div className="bottom-overlay-pad" key="pad" />,
          this.props.hasSignedUp
          && (
          <FloatingButton
            onClick={this.handleCreateTopicClick}
            key="createTopicButton"
          />
          )
        ]);
      } else if (!this.props.hasSignedUp) {
        boardContents = (
          <div className="vertical-center-in-parent">
            <Header color="teal" textAlign="center" as="h2">
                  There are no topics yet!
            </Header>
            <Header color="teal" textAlign="center" as="h4">
                  Sign up to be the first to post.
            </Header>
          </div>
        );
      } else {
        boardContents = (
          <div className="vertical-center-in-parent">
            <Header color="teal" textAlign="center" as="h2">
                  There are no topics yet!
            </Header>
            <Header color="teal" textAlign="center" as="h4">
                  Click the add button at the bottom of the page to be the first
                  to post.
            </Header>
            <FloatingButton
              onClick={this.handleCreateTopicClick}
              key="createTopicButton"
            />
          </div>
        );
      }
    }

    return (
      <div className="fill">
        {boardContents}
      </div>
    );
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }
}

const mapStateToProps = state => ({
  contracts: state.contracts,
  drizzleStatus: state.drizzleStatus,
  hasSignedUp: state.user.hasSignedUp
});

export default withRouter(connect(mapStateToProps)(BoardContainer));
