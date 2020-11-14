import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import TopicListRow from './TopicListRow';
import { PLACEHOLDER_TYPE_TOPIC } from '../../constants/PlaceholderTypes';
import Placeholder from '../Placeholder';
import './styles.css';
import { drizzle } from '../../redux/store';

const { contracts: { Forum: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;

const TopicList = (props) => {
  const { topicIds } = props;
  const [getTopicCallHashes, setGetTopicCallHashes] = useState([]);
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
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

      const handleTopicClick = () => {
        history.push(`/topics/${topicId}`);
      };

      if (topicHash) {
        return (
            <List.Item key={topicId} className="list-item" name={topicId} onClick={handleTopicClick}>
                <TopicListRow id={topicId} topicCallHash={topicHash.hash} />
            </List.Item>
        );
      }

      return (
          <List.Item key={topicId} className="list-item" name={topicId} onClick={() => handleTopicClick(topicId)}>
              <Placeholder
                placeholderType={PLACEHOLDER_TYPE_TOPIC}
                extra={{ topicId }}
              />
          </List.Item>
      );
    }), [getTopicCallHashes, history, topicIds]);

  return (
      <List selection divided id="topic-list" size="big">
          {topics}
      </List>
  );
};

TopicList.propTypes = {
  topicIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

TopicList.whyDidYouRender = true;

export default TopicList;
