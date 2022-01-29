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
          getStats: { cacheCall: getStatsChainData },
        },
      },
    },
  } = drizzle;

  const [numUsers, setNumUsers] = useState(null);
  const [numTopics, setNumTopics] = useState(null);
  const [numPosts, setNumPosts] = useState(null);
  const [getStatsCallHash, setGetStatsCallHash] = useState(null);
  const getStatsResult = useSelector((state) => state.contracts[FORUM_CONTRACT].getStats[getStatsCallHash]);

  useEffect(() => {
    if (getStatsCallHash === null) {
      setGetStatsCallHash(getStatsChainData());
    }
  }, [getStatsCallHash, getStatsChainData]);

  useEffect(() => {
    if (getStatsResult) {
      setNumUsers(parseInt(getStatsResult.value[0], 10));
      setNumTopics(parseInt(getStatsResult.value[1], 10));
      setNumPosts(parseInt(getStatsResult.value[2], 10));
    }
  }, [getStatsResult]);

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
