import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import StatusSegment from '../../../components/Status/StatusSegment';
import StatusKeyRow from '../../../components/Status/StatusKeyRow';
import StatusValueRow from '../../../components/Status/StatusValueRow';
import appLogo from '../../../assets/images/app_logo_circle.svg';

const MainLayoutConcordiaStatus = () => {
  const {
    contracts: {
      [FORUM_CONTRACT]: {
        methods: {
          numUsers: { cacheCall: numUsersChainData },
          numTopics: { cacheCall: numTopicsChainData },
          numPosts: { cacheCall: numPostsChainData },
        },
      },
    },
  } = drizzle;

  const [numUsers, setNumUsers] = useState(null);
  const [numTopics, setNumTopics] = useState(null);
  const [numPosts, setNumPosts] = useState(null);
  const [numUsersCallHash, setNumUsersCallHash] = useState(null);
  const [numTopicsCallHash, setNumTopicsCallHash] = useState(null);
  const [numPostsCallHash, setNumPostsCallHash] = useState(null);
  const numUsersResult = useSelector((state) => state.contracts[FORUM_CONTRACT].numUsers[numUsersCallHash]);
  const numTopicsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].numTopics[numTopicsCallHash]);
  const numPostsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].numPosts[numPostsCallHash]);

  useEffect(() => {
    if (numUsersCallHash === null) {
      setNumUsersCallHash(numUsersChainData());
    }
  }, [numUsersCallHash, numUsersChainData]);

  useEffect(() => {
    if (numTopicsCallHash === null) {
      setNumTopicsCallHash(numTopicsChainData());
    }
  }, [numTopicsCallHash, numTopicsChainData]);

  useEffect(() => {
    if (numPostsCallHash === null) {
      setNumPostsCallHash(numPostsChainData());
    }
  }, [numPostsCallHash, numPostsChainData]);

  useEffect(() => {
    if (numUsersResult) {
      setNumUsers(parseInt(numUsersResult.value, 10));
    }
  }, [numUsersResult]);

  useEffect(() => {
    if (numTopicsResult) {
      setNumTopics(parseInt(numTopicsResult.value, 10));
    }
  }, [numTopicsResult]);

  useEffect(() => {
    if (numPostsResult) {
      setNumPosts(parseInt(numPostsResult.value, 10));
    }
  }, [numPostsResult]);

  return (
      <StatusSegment
        headerTitle="Concordia Status"
        headerImage={appLogo}
      >
          <StatusKeyRow value="Total Users" />
          <StatusValueRow value={numUsers} />
          <StatusKeyRow value="Total Topics" />
          <StatusValueRow value={numTopics} />
          <StatusKeyRow value="Total Posts" />
          <StatusValueRow value={numPosts} />
      </StatusSegment>
  );
};

export default MainLayoutConcordiaStatus;
