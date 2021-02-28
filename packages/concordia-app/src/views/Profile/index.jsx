import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import { Container, Tab } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../redux/store';
import CustomLoadingTabPane from '../../components/CustomLoadingTabPane';
import ProfileTopicList from './ProfileTopicList';
import ProfilePostList from './ProfilePostList';
import GeneralTab from './GeneralTab';
import { GENERAL_TAB, POSTS_TAB, TOPICS_TAB } from '../../constants/ProfileTabs';
import './styles.css';

const { contracts: { [FORUM_CONTRACT]: { methods: { getUser } } } } = drizzle;

const Profile = () => {
  const [userCallHash, setUserCallHash] = useState('');
  const getUserResults = useSelector((state) => state.contracts[FORUM_CONTRACT].getUser);
  const [profileAddress, setProfileAddress] = useState();
  const [username, setUsername] = useState(null);
  const [userTopicIds, setUserTopicIds] = useState([]);
  const [userPostIds, setUserPostIds] = useState([]);
  const [userRegistrationTimestamp, setUserRegistrationTimestamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const self = useSelector((state) => state.user);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (history.location.pathname === '/profile') {
      if (self.hasSignedUp) {
        setProfileAddress(self.address);
      } else {
        history.push('/');
      }
    } else {
      const { id: userAddress } = match.params;

      setProfileAddress(userAddress);
    }
  }, [history, match.params, self.address, self.hasSignedUp]);

  useEffect(() => {
    if (profileAddress) {
      setUserCallHash(getUser.cacheCall(profileAddress));
    }
  }, [profileAddress]);

  useEffect(() => {
    if (getUserResults[userCallHash] !== undefined && getUserResults[userCallHash].value) {
      const [lUsername, topicIds, postIds, registrationTimestamp] = getUserResults[userCallHash].value;
      setUsername(lUsername);
      setUserTopicIds(topicIds.map((userTopicId) => parseInt(userTopicId, 10)));
      setUserPostIds(postIds.map((userPostId) => parseInt(userPostId, 10)));
      setUserRegistrationTimestamp(registrationTimestamp);
      setLoading(false);
    }
  }, [getUserResults, userCallHash]);

  const generalTab = useMemo(() => (loading
    ? null
    : (
        <GeneralTab
          profileAddress={profileAddress}
          username={username}
          numberOfTopics={userTopicIds.length}
          numberOfPosts={userPostIds.length}
          userRegistrationTimestamp={userRegistrationTimestamp}
          isSelf={profileAddress === self.address}
        />
    )), [
    loading, profileAddress, self.address, userPostIds.length, userRegistrationTimestamp, userTopicIds.length, username,
  ]);

  const topicsTab = useMemo(() => (
      <ProfileTopicList username={username} profileAddress={profileAddress} />
  ), [profileAddress, username]);

  const postsTab = useMemo(() => (
      <ProfilePostList username={username} profileAddress={profileAddress} />
  ), [profileAddress, username]);

  const panes = useMemo(() => {
    const generalTabPane = (<CustomLoadingTabPane loading={loading}>{generalTab}</CustomLoadingTabPane>);
    const topicsTabPane = (<CustomLoadingTabPane loading={loading}>{topicsTab}</CustomLoadingTabPane>);
    const postsTabPane = (<CustomLoadingTabPane loading={loading}>{postsTab}</CustomLoadingTabPane>);

    return ([
      { menuItem: t(GENERAL_TAB.intl_display_name_id), render: () => generalTabPane },
      { menuItem: t(TOPICS_TAB.intl_display_name_id), render: () => topicsTabPane },
      { menuItem: t(POSTS_TAB.intl_display_name_id), render: () => postsTabPane },
    ]);
  }, [generalTab, loading, postsTab, t, topicsTab]);

  return useMemo(() => (
      <Container id="profile-container" textAlign="center">
          <Tab panes={panes} />
      </Container>
  ), [panes]);
};

export default memo(Profile);
