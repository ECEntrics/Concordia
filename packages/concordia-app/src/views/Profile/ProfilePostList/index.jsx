import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { Header } from 'semantic-ui-react';
import { drizzle } from '../../../redux/store';
import { ITEMS_PER_PAGE } from '../../../components/PaginationComponent';
import PostList from '../../../components/PostList';

const {
  contracts: {
    [FORUM_CONTRACT]: {
      methods: {
        getUserPostCount: { cacheCall: getUserPostCountChainData },
        getUserPosts: { cacheCall: getUserPostsChainData },
      },
    },
  },
} = drizzle;

const ProfilePostList = (props) => {
  const { username, profileAddress } = props;
  const [pageNumber, setPageNumber] = useState(1);

  const [userPostCount, setUserPostCount] = useState(null);
  const [postIds, setPostIds] = useState([]);

  const [getUserPostCountCallHash, setGetUserPostCountCallHash] = useState(null);
  const [getUserPostsCallHash, setGetUserPostsCallHash] = useState(null);

  const getUserPostCountResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getUserPostCount[getUserPostCountCallHash]);
  const getUserPostsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getUserPosts[getUserPostsCallHash]);

  const { t } = useTranslation();

  useEffect(() => {
    if (getUserPostCountCallHash === null) {
      setGetUserPostCountCallHash(getUserPostCountChainData(profileAddress));
    }
  }, [getUserPostCountCallHash, profileAddress]);

  useEffect(() => {
    if (userPostCount !== null && userPostCount !== 0) {
      const startIndex = Math.max(userPostCount - ITEMS_PER_PAGE * pageNumber, 0);
      const endIndex = userPostCount - ITEMS_PER_PAGE * (pageNumber - 1) - 1;
      setGetUserPostsCallHash(getUserPostsChainData(profileAddress, startIndex, endIndex));
    }
  }, [pageNumber, profileAddress, userPostCount]);

  useEffect(() => {
    if (getUserPostCountResult) {
      setUserPostCount(parseInt(getUserPostCountResult.value, 10));
    }
  }, [getUserPostCountResult, userPostCount]);

  useEffect(() => {
    if (getUserPostsResult) {
      setPostIds(getUserPostsResult.value.slice().reverse().map(Number));
    }
  }, [getUserPostsResult, userPostCount]);

  const handlePageChange = (event, data) => {
    setPageNumber(data.activePage);
  };

  return useMemo(() => {
    if (postIds.length && postIds.length !== 0) {
      return (
          <PostList
            postIds={postIds}
            numberOfItems={userPostCount}
            onPageChange={handlePageChange}
          />
      );
    }
    if (userPostCount === 0) {
      return (
          <Header textAlign="center" as="h2">
              {t('profile.user.has.no.posts.header.message', { user: username })}
          </Header>
      );
    }
    return null;
  }, [t, postIds, userPostCount, username]);
};

export default ProfilePostList;
