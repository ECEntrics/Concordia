import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List } from 'semantic-ui-react';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import TopicListRow from './TopicListRow';
import { drizzle } from '../../redux/store';
import './styles.css';

const { contracts: { [FORUM_CONTRACT]: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;

const TopicList = (props) => {
  const { topicIds } = props;
  const [getTopicCallHashes, setGetTopicCallHashes] = useState([]);
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);

  useEffect(() => {
    if (drizzleInitialized && !drizzleInitializationFailed) {
      const newTopicsFound = topicIds
        .filter((topicId) => !getTopicCallHashes
          .map((getTopicCallHash) => getTopicCallHash.id)
          .includes(topicId));

      if (newTopicsFound.length > 0) {
        setGetTopicCallHashes([
          ...getTopicCallHashes,
          ...newTopicsFound
            .map((topicId) => ({
              id: topicId,
              hash: getTopicChainData(topicId),
            })),
        ]);
      }
    }
  }, [drizzleInitializationFailed, drizzleInitialized, getTopicCallHashes, topicIds]);

  const topics = useMemo(() => topicIds
    .map((topicId) => {
      const topicHash = getTopicCallHashes.find((getTopicCallHash) => getTopicCallHash.id === topicId);

      return (
          <TopicListRow
            id={topicId}
            key={topicId}
            topicCallHash={topicHash && topicHash.hash}
            loading={topicHash === undefined}
          />
      );
    }), [getTopicCallHashes, topicIds]);

  return (
      <List id="topic-list" size="big">
          {topics}
      </List>
  );
};

TopicList.propTypes = {
  topicIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TopicList;
