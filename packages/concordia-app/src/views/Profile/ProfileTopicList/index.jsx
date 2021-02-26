import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { Header } from 'semantic-ui-react';
import { drizzle } from '../../../redux/store';
import { ITEMS_PER_PAGE } from '../../../components/PaginationComponent';
import TopicList from '../../../components/TopicList';

const {
  contracts: {
    [FORUM_CONTRACT]: {
      methods: {
        getUserTopicCount: { cacheCall: getUserTopicCountChainData },
        getUserTopics: { cacheCall: getUserTopicsChainData },
      },
    },
  },
} = drizzle;

const ProfileTopicList = (props) => {
  const { username, profileAddress } = props;
  const [pageNumber, setPageNumber] = useState(1);

  const [userTopicCount, setUserTopicCount] = useState(null);
  const [topicIds, setTopicIds] = useState([]);

  const [getUserTopicCountCallHash, setGetUserTopicCountCallHash] = useState(null);
  const [getUserTopicsCallHash, setGetUserTopicsCallHash] = useState(null);

  const getUserTopicCountResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getUserTopicCount[getUserTopicCountCallHash]);
  const getUserTopicsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getUserTopics[getUserTopicsCallHash]);

  const { t } = useTranslation();

  useEffect(() => {
    if (getUserTopicCountCallHash === null) {
      setGetUserTopicCountCallHash(getUserTopicCountChainData(profileAddress));
    }
  }, [getUserTopicCountCallHash, profileAddress]);

  useEffect(() => {
    if (userTopicCount !== null && userTopicCount !== 0) {
      const startIndex = Math.max(userTopicCount - ITEMS_PER_PAGE * pageNumber, 0);
      const endIndex = userTopicCount - ITEMS_PER_PAGE * (pageNumber - 1) - 1;
      setGetUserTopicsCallHash(getUserTopicsChainData(profileAddress, startIndex, endIndex));
    }
  }, [pageNumber, profileAddress, userTopicCount]);

  useEffect(() => {
    if (getUserTopicCountResult) {
      setUserTopicCount(parseInt(getUserTopicCountResult.value, 10));
    }
  }, [getUserTopicCountResult, userTopicCount]);

  useEffect(() => {
    if (getUserTopicsResult) {
      setTopicIds(getUserTopicsResult.value.slice().reverse().map(Number));
    }
  }, [getUserTopicsResult, userTopicCount]);

  const handlePageChange = (event, data) => {
    setPageNumber(data.activePage);
  };

  return useMemo(() => {
    if (topicIds.length && topicIds.length !== 0) {
      return (
          <TopicList
            topicIds={topicIds}
            numberOfItems={userTopicCount}
            onPageChange={handlePageChange}
          />
      );
    }
    if (userTopicCount === 0) {
      return (
          <Header textAlign="center" as="h2">
              {t('profile.user.has.no.topics.header.message', { user: username })}
          </Header>
      );
    }
    return null;
  }, [t, topicIds, userTopicCount, username]);
};

export default ProfileTopicList;
