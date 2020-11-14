import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';

const { orbit } = breeze;

const TopicListRow = (props) => {
  const { id: topicId, topicCallHash } = props;
  const getTopicResults = useSelector((state) => state.contracts.Forum.getTopic);
  const [numberOfReplies, setNumberOfReplies] = useState(null);
  const [username, setUsername] = useState(null);
  const [topicAuthor, setTopicAuthor] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [topicSubject, setTopicSubject] = useState(null);
  const userAddress = useSelector((state) => state.user.address);
  const topics = useSelector((state) => state.orbitData.topics);
  const dispatch = useDispatch();

  useEffect(() => {
    if (topicCallHash && getTopicResults[topicCallHash] !== undefined) {
      setTopicAuthor(getTopicResults[topicCallHash].value[0]);
      setUsername(getTopicResults[topicCallHash].value[1]);
      setTimestamp(getTopicResults[topicCallHash].value[2] * 1000);
      setNumberOfReplies(getTopicResults[topicCallHash].value[3].length);
    }
  }, [getTopicResults, topicCallHash]);

  useEffect(() => {
    if (topicAuthor && userAddress !== topicAuthor) {
      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        userAddress: topicAuthor,
      });
    }
  }, [dispatch, topicAuthor, userAddress]);

  useEffect(() => {
    const topicFound = topics
      .find((topic) => topic.id === topicId);

    if (topicFound) {
      setTopicSubject(topicFound);
    }
  }, [topicId, topics]);

  return useMemo(() => (
      <>
          <List.Header>
              <List.Icon name="right triangle" />
              {topicSubject && topicSubject.subject}
          </List.Header>
          <List.Content>
              {username}
              {numberOfReplies}
              {' '}
              replies
              {timestamp}
          </List.Content>
      </>
  ), [topicSubject, username, numberOfReplies, timestamp]);
};

TopicListRow.propTypes = {
  id: PropTypes.number.isRequired,
  topicCallHash: PropTypes.string.isRequired,
};

TopicListRow.whyDidYouRender = true;

export default memo(TopicListRow);
