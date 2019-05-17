import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Topic from './Topic';
import PlaceholderContainer from './PlaceholderContainer';
import { determineDBAddress } from '../utils/orbitUtils';

const contract = 'Forum';
const getTopicMethod = 'getTopic';

class TopicList extends Component {
  constructor(props) {
    super(props);

    this.getBlockchainData = this.getBlockchainData.bind(this);

    this.state = {
      dataKeys: [],
      dbAddresses: []
    };
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    const { dataKeys, dbAddresses } = this.state;
    const { drizzleStatus, topicIDs, contracts } = this.props;

    if (drizzleStatus.initialized) {
      const dataKeysShallowCopy = dataKeys.slice();
      let fetchingNewData = false;

      topicIDs.forEach(async (topicID) => {
        if (!dataKeys[topicID]) {
          dataKeysShallowCopy[topicID] = drizzle.contracts[contract].methods[getTopicMethod]
            .cacheCall(topicID);
          fetchingNewData = true;
        }
        else if (!dbAddresses[topicID]){
          const fetchedTopicData = contracts[contract][getTopicMethod][dataKeys[topicID]];
          if(fetchedTopicData) {
            const dbAddress = await determineDBAddress('topics', fetchedTopicData.value[0]);
            const dbAddressesShallowCopy = dbAddresses.slice();
            dbAddressesShallowCopy[topicID] = dbAddress;
            this.setState({
              dbAddresses: dbAddressesShallowCopy
            });
          }
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
    const { dataKeys, dbAddresses } = this.state;
    const { topicIDs, contracts } = this.props;

    const topics = topicIDs.map(topicID => {
      let fetchedTopicData;
      if(dataKeys[topicID])
        fetchedTopicData = contracts[contract][getTopicMethod][dataKeys[topicID]];

      const dbAddress = dbAddresses[topicID];
      if(fetchedTopicData && dbAddress) {
        const userAddress = fetchedTopicData.value[0]; //Also works as an Orbit Identity ID
        const topicData = {
          userAddress,
          fullOrbitAddress: `/orbitdb/${dbAddress}/topics`,
          userName: fetchedTopicData.value[1],
          timestamp: fetchedTopicData.value[2]*1000,
          numberOfReplies: fetchedTopicData.value[3].length
        };
        return(
          <Topic
            topicData={topicData}
            topicID={topicID}
            key={topicID}
          />
        )
      }

      return (<PlaceholderContainer placeholderType='Topic'
        extra={{topicID: topicID}} key={topicID} />);
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
