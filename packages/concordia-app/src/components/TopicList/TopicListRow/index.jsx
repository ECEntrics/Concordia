import React, { useContext, useEffect, useState } from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import AppContext from '../../AppContext';

const TopicListRow = (props) => {
  const { topicData, topicId } = props;
  const { breeze: { orbit } } = useContext(AppContext.Context);
  const [topicSubject, setTopicSubject] = useState();
  const userAddress = useSelector((state) => state.user.address);

  useEffect(() => {
    if (userAddress === topicData.userAddress) {
      const topicsDb = Object.values(orbit.stores).find((store) => store.dbname === 'topics');

      setTopicSubject(topicsDb.get(topicId));
      return;
    }

    // TODO: this is not correct, each TopicListRow inside the TopicList overrides the on.replicated callback. As a
    //  result, for the topics of each user, only the callback of the last TopicListRow in the list survives and gets
    //  executed. Moving these calls up on the TopicList helps with this issue but introduces other problems.
    orbit
      .determineAddress('topics', 'keyvalue', { accessController: { write: [topicData.userAddress] } })
      .then((ipfsMultihash) => {
        const peerDbAddress = `/orbitdb/${ipfsMultihash.root}/topics`;

        return orbit.keyvalue(peerDbAddress)
          .then((keyValueStore) => {
            keyValueStore.events.on('replicated', () => {
              setTopicSubject(keyValueStore.get(topicId));
            });
          })
          .catch((error) => console.error(`Error opening a peer's db: ${error}`));
      })
      .catch((error) => console.error(`Error opening a peer's db: ${error}`));
  }, [orbit, topicData.userAddress, topicId, userAddress]);

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
