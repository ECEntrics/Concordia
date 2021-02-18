import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import TopicList from '../../TopicList';
import PaginationComponent, { ITEMS_PER_PAGE } from '../index';
import './styles.css';

const {
  contracts: {
    [FORUM_CONTRACT]: {
      methods: {
        numTopics: { cacheCall: numTopicsChainData },
      },
    },
  },
} = drizzle;

const PaginatedTopicList = () => {
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
  const [pageNumber, setPageNumber] = useState(1);
  const [numTopics, setNumTopics] = useState(null);
  const [topicIds, setTopicIds] = useState([]);
  const [numTopicsCallHash, setNumTopicsCallHash] = useState(null);

  const numTopicsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].numTopics[numTopicsCallHash]);

  useEffect(() => {
    if (drizzleInitialized && !drizzleInitializationFailed && numTopicsCallHash === null) {
      setNumTopicsCallHash(numTopicsChainData());
    }
  }, [drizzleInitializationFailed, drizzleInitialized, numTopicsCallHash]);

  useEffect(() => {
    if (drizzleInitialized && !drizzleInitializationFailed && numTopics !== null) {
      setTopicIds(_.rangeRight(Math.max(numTopics - ITEMS_PER_PAGE * pageNumber, 0),
        numTopics - ITEMS_PER_PAGE * (pageNumber - 1)));
    }
  }, [pageNumber, drizzleInitializationFailed, drizzleInitialized, numTopics]);

  useEffect(() => {
    if (numTopicsResult) {
      setNumTopics(numTopicsResult.value);
    }
  }, [numTopicsResult]);

  const handlePageChange = (event, data) => {
    setPageNumber(data.activePage);
  };

  return useMemo(() => (
      <div id="paginated-topic-list">
          <TopicList topicIds={topicIds} />
          <PaginationComponent onPageChange={handlePageChange} numberOfItems={numTopics} />
      </div>
  ), [numTopics, topicIds]);
};

export default PaginatedTopicList;
