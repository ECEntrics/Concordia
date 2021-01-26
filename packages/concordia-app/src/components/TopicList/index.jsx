import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, List } from 'semantic-ui-react';
import TopicListRow from './TopicListRow';
import { drizzle } from '../../redux/store';
import { FORUM_CONTRACT } from '../../constants/contracts/ContractNames';
import './styles.css';

const { contracts: { [FORUM_CONTRACT]: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;

const TopicList = (props) => {
  const { topicIds } = props;
  const [getTopicCallHashes, setGetTopicCallHashes] = useState([]);
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const history = useHistory();

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
      <div>
          {hasSignedUp && history.location.pathname === '/home' && (
              <Button
                content="New Topic"
                icon="plus"
                labelPosition="left"
                positive
                id="new-topic-button"
                onClick={() => history.push('/topics/new')}
              />
          )}
          <List id="topic-list" size="big">
              {topics}
          </List>
      </div>
  );
};

TopicList.propTypes = {
  topicIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TopicList;
