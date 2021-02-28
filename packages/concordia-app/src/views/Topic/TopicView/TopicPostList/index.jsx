import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import PostList from '../../../../components/PostList';
import { ITEMS_PER_PAGE } from '../../../../components/PaginationComponent';
import { drizzle } from '../../../../redux/store';

const {
  contracts: {
    [FORUM_CONTRACT]: {
      methods: {
        getTopicPostCount: { cacheCall: getTopicPostCountChainData },
        getTopicPosts: { cacheCall: getTopicPostsChainData },
      },
    },
  },
} = drizzle;

const TopicPostList = (props) => {
  const {
    topicId, loading, focusOnPost,
  } = props;
  const [pageNumber, setPageNumber] = useState(1);

  const [topicPostCount, setTopicPostCount] = useState(null);
  const [postIds, setPostIds] = useState([]);

  const [getTopicPostCountCallHash, setGetTopicPostCountCallHash] = useState(null);
  const [getTopicPostsCallHash, setGetTopicPostsCallHash] = useState(null);

  const getTopicPostCountResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getTopicPostCount[getTopicPostCountCallHash]);
  const getTopicPostsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getTopicPosts[getTopicPostsCallHash]);

  useEffect(() => {
    if (getTopicPostCountCallHash === null) {
      setGetTopicPostCountCallHash(getTopicPostCountChainData(topicId));
    }
  }, [getTopicPostCountCallHash, topicId]);

  useEffect(() => {
    if (topicPostCount !== null && topicPostCount !== 0) {
      const startIndex = ITEMS_PER_PAGE * (pageNumber - 1);
      const endIndex = Math.min(ITEMS_PER_PAGE * pageNumber - 1, topicPostCount - 1);
      setGetTopicPostsCallHash(getTopicPostsChainData(topicId, startIndex, endIndex));
    }
  }, [pageNumber, topicId, topicPostCount]);

  useEffect(() => {
    if (getTopicPostCountResult) {
      setTopicPostCount(parseInt(getTopicPostCountResult.value, 10));
    }
  }, [getTopicPostCountResult, topicPostCount]);

  useEffect(() => {
    if (getTopicPostsResult) {
      setPostIds(getTopicPostsResult.value.slice().map(Number));
    }
  }, [getTopicPostsResult, topicPostCount]);

  const handlePageChange = (event, data) => {
    setPageNumber(data.activePage);
  };

  return useMemo(() => {
    if (postIds.length && postIds.length !== 0) {
      return (
          <PostList
            postIds={postIds}
            numberOfItems={topicPostCount}
            onPageChange={handlePageChange}
            loading={loading}
            focusOnPost={focusOnPost}
          />
      );
    }
    return null;
  }, [postIds, topicPostCount, loading, focusOnPost]);
};

export default TopicPostList;
