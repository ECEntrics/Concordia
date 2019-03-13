import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Topic from './Topic';

const contract = 'Forum';
const getTopicMethod = 'getTopic';

class TopicList extends Component {
  constructor(props) {
    super(props);

    this.getBlockchainData = this.getBlockchainData.bind(this);

    this.state = {
      dataKeys: []
    };
  }

  getBlockchainData() {
    if (this.props.drizzleStatus.initialized) {
      const dataKeysShallowCopy = this.state.dataKeys.slice();
      let fetchingNewData = false;

      this.props.topicIDs.forEach((topicID) => {
        if (!this.state.dataKeys[topicID]) {
          dataKeysShallowCopy[topicID] = drizzle.contracts[contract].methods[getTopicMethod].cacheCall(
            topicID,
          );
          fetchingNewData = true;
        }
      });

      if (fetchingNewData) {
        this.setState({
          dataKeys: dataKeysShallowCopy
        });
      }
    }
  }

  render() {
    const topics = this.props.topicIDs.map(topicID => (
      <Topic
        topicData={(this.state.dataKeys[topicID]
              && this.props.contracts[contract][getTopicMethod][this.state.dataKeys[topicID]])
          ? this.props.contracts[contract][getTopicMethod][this.state.dataKeys[topicID]]
          : null}
        topicID={topicID}
        key={topicID}
      />
    ));

    return (
      <div className="topics-list">
        {topics.slice(0).reverse()}
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
  drizzleStatus: state.drizzleStatus
});

export default connect(mapStateToProps)(TopicList);
