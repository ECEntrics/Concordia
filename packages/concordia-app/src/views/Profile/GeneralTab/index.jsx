import React, { useEffect, useMemo, useState } from 'react';
import {
  Icon, Image, Placeholder, Table,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import determineKVAddress from '../../../utils/orbitUtils';
import databases, { USER_DATABASE } from '../../../constants/orbit/OrbitDatabases';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import { USER_LOCATION, USER_PROFILE_PICTURE } from '../../../constants/orbit/UserDatabaseKeys';
import './styles.css';

const { orbit } = breeze;

const GeneralTab = (props) => {
  const {
    profileAddress, username, numberOfTopics, numberOfPosts, userRegistrationTimestamp,
  } = props;
  const [userInfoOrbitAddress, setUserInfoOrbitAddress] = useState(null);
  const [userTopicsOrbitAddress, setUserTopicsOrbitAddress] = useState(null);
  const [userPostsOrbitAddress, setUserPostsOrbitAddress] = useState(null);
  const [profileMeta, setProfileMeta] = useState(null);
  const users = useSelector((state) => state.orbitData.users);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (profileAddress) {
      Promise
        .all(databases
          .map((database) => determineKVAddress({
            orbit,
            dbName: database.address,
            userAddress: profileAddress,
          })))
        .then((values) => {
          const [userOrbitAddress, topicsOrbitAddress, postsOrbitAddress] = values;
          setUserInfoOrbitAddress(userOrbitAddress);
          setUserTopicsOrbitAddress(topicsOrbitAddress);
          setUserPostsOrbitAddress(postsOrbitAddress);

          const userFound = users
            .find((user) => user.id === userOrbitAddress);

          if (userFound) {
            setProfileMeta(userFound);
          } else {
            dispatch({
              type: FETCH_USER_DATABASE,
              orbit,
              dbName: USER_DATABASE,
              userAddress: userOrbitAddress,
            });
          }
        }).catch((error) => {
          console.error('Error during determination of key-value DB address:', error);
        });
    }
  }, [dispatch, profileAddress, users]);

  const authorAvatar = useMemo(() => (profileMeta !== null && profileMeta[USER_PROFILE_PICTURE]
    ? (
        <Image
          className="general-tab-profile-picture"
          centered
          size="tiny"
          src={profileMeta[USER_PROFILE_PICTURE]}
        />
    )
    : (
        <Icon
          name="user circle"
          size="massive"
          inverted
          color="black"
          verticalAlign="middle"
        />
    )), [profileMeta]);

  const userLocation = useMemo(() => {
    if (profileMeta === null) {
      return (
          <Placeholder><Placeholder.Line length="medium" /></Placeholder>
      );
    } if (profileMeta[USER_LOCATION] === undefined) {
      return <span className="text-secondary">{t('profile.general.tab.location.row.not.set')}</span>;
    }
    return profileMeta[USER_LOCATION];
  }, [profileMeta, t]);

  return useMemo(() => (
      <Table basic="very" singleLine>
          <Table.Body>
              <Table.Row textAlign="center">
                  <Table.Cell colSpan="3">{authorAvatar}</Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.username.row.title')}</strong></Table.Cell>
                  <Table.Cell>{username}</Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.address.row.title')}</strong></Table.Cell>
                  <Table.Cell>{profileAddress}</Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.user.db.address.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {userInfoOrbitAddress || (<Placeholder><Placeholder.Line /></Placeholder>)}
                  </Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.topics.db.address.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {userTopicsOrbitAddress || (<Placeholder><Placeholder.Line /></Placeholder>)}
                  </Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.posts.db.address.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {userPostsOrbitAddress || (<Placeholder><Placeholder.Line /></Placeholder>)}
                  </Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.number.of.topics.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {numberOfTopics}
                  </Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.number.of.posts.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {numberOfPosts}
                  </Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.location.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {userLocation}
                  </Table.Cell>
              </Table.Row>
              <Table.Row>
                  <Table.Cell><strong>{t('profile.general.tab.registration.date.row.title')}</strong></Table.Cell>
                  <Table.Cell>
                      {new Date(userRegistrationTimestamp * 1000).toLocaleString()}
                  </Table.Cell>
              </Table.Row>
          </Table.Body>
      </Table>
  ), [
    authorAvatar, numberOfPosts, numberOfTopics, profileAddress, profileMeta, t, userInfoOrbitAddress,
    userPostsOrbitAddress, userRegistrationTimestamp, userTopicsOrbitAddress, username,
  ]);
};

GeneralTab.propTypes = {
  profileAddress: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  numberOfTopics: PropTypes.number.isRequired,
  numberOfPosts: PropTypes.number.isRequired,
  userRegistrationTimestamp: PropTypes.string.isRequired,
};

export default GeneralTab;
