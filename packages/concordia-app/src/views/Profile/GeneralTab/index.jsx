import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Icon, Placeholder, Table,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { USER_DATABASE, databases } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import { USER_LOCATION, USER_PROFILE_PICTURE } from '../../../constants/orbit/UserDatabaseKeys';
import EditInformationModal from './EditInformationModal';
import ProfileImage from '../../../components/ProfileImage';
import './styles.css';

const { orbit } = breeze;

const GeneralTab = (props) => {
  const {
    profileAddress, username, numberOfTopics, numberOfPosts, userRegistrationTimestamp, isSelf,
  } = props;
  const [userInfoOrbitAddress, setUserInfoOrbitAddress] = useState(null);
  const [userTopicsOrbitAddress, setUserTopicsOrbitAddress] = useState(null);
  const [userPostsOrbitAddress, setUserPostsOrbitAddress] = useState(null);
  const [profileMetadataFetched, setProfileMetadataFetched] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [editingProfileInformation, setEditingProfileInformation] = useState(false);
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
            setProfileMetadataFetched(true);
            setUserAvatarUrl(userFound[USER_PROFILE_PICTURE]);
            setUserLocation(userFound[USER_LOCATION]);
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

  const userLocationCell = useMemo(() => {
    if (!profileMetadataFetched) {
      return (
          <Placeholder><Placeholder.Line length="medium" /></Placeholder>
      );
    }

    if (!userLocation) {
      return <span className="text-secondary">{t('profile.general.tab.location.row.not.set')}</span>;
    }

    return userLocation;
  }, [profileMetadataFetched, t, userLocation]);

  const handleEditInfoClick = () => {
    setEditingProfileInformation(true);
  };

  const closeEditInformationModal = () => {
    setEditingProfileInformation(false);
  };

  const editInformationModal = useMemo(() => profileMetadataFetched && (
      <EditInformationModal
        profileAddress={profileAddress}
        initialUsername={username}
        initialAuthorAvatar={userAvatarUrl}
        initialUserLocation={userLocation}
        open={editingProfileInformation}
        onCancel={closeEditInformationModal}
        onSubmit={closeEditInformationModal}
      />
  ), [editingProfileInformation, profileAddress, profileMetadataFetched, userAvatarUrl, userLocation, username]);

  return useMemo(() => (
      <>
          <Table basic="very" singleLine>
              <Table.Body>
                  <Table.Row textAlign="center">
                      <Table.Cell colSpan="3" className="profile-image">
                          <ProfileImage
                            profileAddress={profileAddress}
                            profileUsername={username}
                            avatarUrl={userAvatarUrl}
                            size="160"
                          />
                      </Table.Cell>
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
                          {userLocationCell}
                      </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell><strong>{t('profile.general.tab.registration.date.row.title')}</strong></Table.Cell>
                      <Table.Cell>
                          {new Date(userRegistrationTimestamp * 1000).toLocaleString('el-gr', { hour12: false })}
                      </Table.Cell>
                  </Table.Row>
              </Table.Body>

              {isSelf && (
                  <Table.Footer fullWidth>
                      <Table.Row>
                          <Table.HeaderCell colSpan="2">
                              <Button
                                id="edit-info-button"
                                className="primary-button"
                                floated="right"
                                icon
                                labelPosition="left"
                                primary
                                disabled={!profileMetadataFetched}
                                size="small"
                                onClick={handleEditInfoClick}
                              >
                                  <Icon name="edit" />
                                  {t('profile.general.tab.edit.info.button.title')}
                              </Button>
                          </Table.HeaderCell>
                      </Table.Row>
                  </Table.Footer>
              )}
          </Table>
          {isSelf && editInformationModal}
      </>
  ), [editInformationModal, isSelf, numberOfPosts, numberOfTopics, profileAddress, profileMetadataFetched, t, userAvatarUrl, userInfoOrbitAddress, userLocationCell, userPostsOrbitAddress, userRegistrationTimestamp, userTopicsOrbitAddress, username]);
};

GeneralTab.defaultProps = {
  isSelf: false,
};

GeneralTab.propTypes = {
  profileAddress: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  numberOfTopics: PropTypes.number.isRequired,
  numberOfPosts: PropTypes.number.isRequired,
  userRegistrationTimestamp: PropTypes.string.isRequired,
  isSelf: PropTypes.bool,
};

export default GeneralTab;
