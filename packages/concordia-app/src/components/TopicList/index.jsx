import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List } from 'semantic-ui-react';
import AppContext from '../AppContext';
import TopicListRow from './TopicListRow';
import { PLACEHOLDER_TYPE_TOPIC } from '../../constants/PlaceholderTypes';
import Placeholder from '../Placeholder';
import './styles.css';
import { useHistory } from 'react-router';

const TopicList = (props) => {
  const { topicIds } = props;
  const { drizzle: { contracts: { Forum: { methods: { getTopic } } } } } = useContext(AppContext.Context);
  const [getTopicCallHashes, setGetTopicCallHashes] = useState([]);
  const getTopicResults = useSelector((state) => state.contracts.Forum.getTopic);
  const drizzleStatus = useSelector((state) => state.drizzleStatus);
  const history = useHistory();

  useEffect(() => {
    // TODO: is the drizzleStatus check necessary?
    if (drizzleStatus.initialized && !drizzleStatus.failed && getTopicCallHashes.length === 0) {
      setGetTopicCallHashes(topicIds.map((topicId) => ({
        id: topicId,
        hash: getTopic.cacheCall(topicId),
      })));
    }
  }, [drizzleStatus.failed, drizzleStatus.initialized, getTopic, getTopicCallHashes, topicIds]);

  const handleTopicClick = useCallback((topicId) => {
    history.push(`/topics/${topicId}`);
  }, [history]);

  const topics = useMemo(() => topicIds
    .map((topicId) => {
      const getTopicHash = getTopicCallHashes.find((getTopicCallHash) => getTopicCallHash.id === topicId);

      if (getTopicHash && getTopicResults[getTopicHash.hash] !== undefined) {
        const topicData = {
          userAddress: getTopicResults[getTopicHash.hash].value[0],
          username: getTopicResults[getTopicHash.hash].value[1],
          timestamp: getTopicResults[getTopicHash.hash].value[2] * 1000,
          numberOfReplies: getTopicResults[getTopicHash.hash].value[3].length,
        };
        return (
            <List.Item key={topicId} className="list-item" name={topicId} onClick={() => handleTopicClick(topicId)}>
                <TopicListRow
                  topicData={topicData}
                  topicId={topicId}
                />
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
    }), [getTopicCallHashes, getTopicResults, handleTopicClick, topicIds]);

  return (
      <List selection divided id="topic-list" size="big">
          {topics}
      </List>
  );
};

TopicList.propTypes = {
  topicIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TopicList;
