import React, { useContext, useMemo } from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import AppContext from '../../AppContext';

const TopicListRow = (props) => {
  const { topicData, topicId } = props;

  const {
    breeze: {
      orbit: {
        stores,
      },
    },
  } = useContext(AppContext.Context);

  const topicSubject = useMemo(() => {
    const topicsDb = Object.values(stores).find((store) => store.dbname === 'topics');

    return topicsDb.get(topicId);
  }, [stores, topicId]);

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
  timestamp: PropTypes.string.isRequired,
  numberOfReplies: PropTypes.number.isRequired,
});

TopicListRow.propTypes = {
  topicData: TopicData.isRequired,
  topicId: PropTypes.number.isRequired,
};

export default TopicListRow;
