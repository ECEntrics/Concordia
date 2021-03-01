import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import { ITEMS_PER_PAGE } from '../../../components/PaginationComponent';
import TopicList from '../../../components/TopicList';

const {
  contracts: {
    [FORUM_CONTRACT]: {
      methods: {
        numTopics: { cacheCall: numTopicsChainData },
      },
    },
  },
} = drizzle;

const HomeTopicList = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numTopics, setNumTopics] = useState(null);
  const [topicIds, setTopicIds] = useState([]);
  const [numTopicsCallHash, setNumTopicsCallHash] = useState(null);

  const numTopicsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].numTopics[numTopicsCallHash]);

  useEffect(() => {
    if (numTopicsCallHash === null) {
      setNumTopicsCallHash(numTopicsChainData());
    }
  }, [numTopicsCallHash]);

  useEffect(() => {
    if (numTopics !== null) {
      setTopicIds(_.rangeRight(Math.max(numTopics - ITEMS_PER_PAGE * pageNumber, 0),
        numTopics - ITEMS_PER_PAGE * (pageNumber - 1)));
    }
  }, [numTopics, pageNumber]);

  useEffect(() => {
    if (numTopicsResult) {
      setNumTopics(parseInt(numTopicsResult.value, 10) || 0);
    }
  }, [numTopicsResult]);

  const handlePageChange = (event, data) => {
    setPageNumber(data.activePage);
  };

  return useMemo(() => {
    if (numTopics !== null) {
      return (
          <TopicList
            topicIds={topicIds}
            numberOfItems={numTopics}
            onPageChange={handlePageChange}
          />
      );
    }
    return null;
  }, [numTopics, topicIds]);
};

export default HomeTopicList;
