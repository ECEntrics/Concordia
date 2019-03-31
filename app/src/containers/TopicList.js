import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    const { dataKeys } = this.state;
    const { drizzleStatus, topicIDs } = this.props;

    if (drizzleStatus.initialized) {
      const dataKeysShallowCopy = dataKeys.slice();
      let fetchingNewData = false;

      topicIDs.forEach((topicID) => {
        if (!dataKeys[topicID]) {
          dataKeysShallowCopy[topicID] = drizzle.contracts[contract].methods[getTopicMethod]
            .cacheCall(topicID);
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
    const { dataKeys } = this.state;
    const { topicIDs, contracts } = this.props;

    const topics = topicIDs.map(topicID => {
      let fetchedTopicData;
      if(dataKeys[topicID])
        fetchedTopicData = contracts[contract][getTopicMethod][dataKeys[topicID]];

      if(fetchedTopicData) {
        const topicData = {
          userAddress: fetchedTopicData.value[0],
          fullOrbitAddress: `/orbitdb/${fetchedTopicData.value[0]}/topics`,
          userName: fetchedTopicData.value[2],
          timestamp: fetchedTopicData.value[3]*1000,
          nReplies: fetchedTopicData.value[4].length
        };
        return(
          <Topic
            topicData={topicData}
            topicID={topicID}
            key={topicID}
          />
        )
      }

      return (<div key={topicID}>TODO: Loading UI/fetching needs to be changed (?)</div>);
    });

    //TODO: Return loading indicator instead of topics when not fully loaded (?)
    return (
      <div className="topics-list">
        {topics.slice(0).reverse()}
      </div>
    );
  }
}

TopicList.propTypes = {
  topicIDs: PropTypes.arrayOf(PropTypes.number).isRequired,
  contracts: PropTypes.PropTypes.objectOf(PropTypes.object).isRequired,
  drizzleStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  contracts: state.contracts,
  drizzleStatus: state.drizzleStatus
});

export default connect(mapStateToProps)(TopicList);
