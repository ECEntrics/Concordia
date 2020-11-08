import React, { useContext, useEffect, useState } from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import AppContext from '../../AppContext';
import { FETCH_USER_TOPIC } from '../../../redux/actions/peerDbReplicationActions';

const TopicListRow = (props) => {
  const { topicData, topicId } = props;
  const { breeze: { orbit } } = useContext(AppContext.Context);
  const [topicSubject, setTopicSubject] = useState();
  const userAddress = useSelector((state) => state.user.address);
  const topics = useSelector((state) => state.orbitData.topics);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userAddress === topicData.userAddress) {
      const topicsDb = Object.values(orbit.stores).find((store) => store.dbname === 'topics');

      setTopicSubject(topicsDb.get(topicId));
      return;
    }

    dispatch({
      type: FETCH_USER_TOPIC,
      orbit,
      userAddress: topicData.userAddress,
      topicId,
    });
  }, [dispatch, orbit, topicData.userAddress, topicId, userAddress]);

  useEffect(() => {
    const topicFound = topics.find((topic) => topic.topicId === topicId);

    if (topicFound) {
      setTopicSubject(topicFound);
    }
  }, [topicId, topics]);

  return (
      <>
          <List.Header>
              <List.Icon name="right triangle" />
              {topicSubject && topicSubject.subject}
          </List.Header>
          <List.Content>
              {topicData.username}
              {topicData.numberOfReplies}
              {' '}
              replies
              timestamp
          </List.Content>
      </>
  );
};

const TopicData = PropTypes.PropTypes.shape({
  userAddress: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  numberOfReplies: PropTypes.number.isRequired,
});

TopicListRow.propTypes = {
  topicData: TopicData.isRequired,
  topicId: PropTypes.number.isRequired,
};

export default TopicListRow;
