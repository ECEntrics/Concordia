import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import TopicListRow from './TopicListRow';
import PaginationComponent from '../PaginationComponent';
import { drizzle } from '../../redux/store';
import './styles.css';

const { contracts: { [FORUM_CONTRACT]: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;

const TopicList = (props) => {
  const { topicIds, numberOfItems, onPageChange } = props;
  const [getTopicCallHashes, setGetTopicCallHashes] = useState([]);

  useEffect(() => {
    setGetTopicCallHashes(
      topicIds
        .map((topicId) => ({
          id: topicId,
          hash: getTopicChainData(topicId),
        })),
    );
  }, [topicIds]);

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
          <List id="topic-list" size="big">
              {topics}
          </List>
          <PaginationComponent onPageChange={onPageChange} numberOfItems={numberOfItems} />
      </div>
  );
};

TopicList.propTypes = {
  topicIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  numberOfItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
};

export default TopicList;
