import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Dimmer, Grid, Image, List, Placeholder,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import './styles.css';
import { POSTS_DATABASE, USER_DATABASE } from '../../../constants/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { PROFILE_PICTURE } from '../../../constants/UserDatabaseKeys';

const { orbit } = breeze;

const PostListRow = (props) => {
  const { id: postId, postCallHash, loading } = props;
  const getPostResults = useSelector((state) => state.contracts.Forum.getPost);
  const [postAuthorAddress, setPostAuthorAddress] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const [postSubject, setPostSubject] = useState(null);
  const [postMessage, setPostMessage] = useState(null);
  const [postAuthorMeta, setPostAuthorMeta] = useState(null);
  const userAddress = useSelector((state) => state.user.address);
  const posts = useSelector((state) => state.orbitData.posts);
  const users = useSelector((state) => state.orbitData.users);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && postCallHash && getPostResults[postCallHash] !== undefined) {
      setPostAuthorAddress(getPostResults[postCallHash].value[0]);
      setPostAuthor(getPostResults[postCallHash].value[1]);
      setTimeAgo(moment(getPostResults[postCallHash].value[2] * 1000).fromNow());
    }
  }, [getPostResults, loading, postCallHash]);

  useEffect(() => {
    if (postAuthorAddress && userAddress !== postAuthorAddress) {
      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        dbName: POSTS_DATABASE,
        userAddress: postAuthorAddress,
      });

      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        dbName: USER_DATABASE,
        userAddress: postAuthorAddress,
      });
    }
  }, [dispatch, postAuthorAddress, userAddress]);

  useEffect(() => {
    const postFound = posts
      .find((post) => post.id === postId);

    if (postFound) {
      setPostSubject(postFound.subject);
      setPostMessage(postFound.message);
    }
  }, [postId, posts]);

  useEffect(() => {
    if (postAuthorAddress !== null) {
      determineKVAddress({ orbit, dbName: USER_DATABASE, userAddress: postAuthorAddress })
        .then((userOrbitAddress) => {
          const userFound = users
            .find((user) => user.id === userOrbitAddress);

          if (userFound) {
            setPostAuthorMeta(userFound);
          }
        })
        .catch((error) => {
          console.error('Error during determination of key-value DB address:', error);
        });
    }
  }, [postAuthorAddress, users]);

  return useMemo(() => (
      <Dimmer.Dimmable as={List.Item} blurring dimmed={loading} className="list-item">
          {postAuthorMeta !== null && postAuthorMeta[PROFILE_PICTURE]
            ? (
                <Image
                  className="profile-picture"
                  avatar
                  src={postAuthorMeta[PROFILE_PICTURE]}
                />
            )
            : (
                <List.Icon
                  name="user circle"
                  size="big"
                  inverted
                  color="black"
                  verticalAlign="middle"
                />
            )}
          <List.Content className="list-content">
              <List.Header>
                  <Grid>
                      <Grid.Column floated="left" width={14}>
                          {postSubject !== null
                            ? postSubject
                            : <Placeholder><Placeholder.Line length="very long" /></Placeholder>}
                      </Grid.Column>
                      <Grid.Column floated="right" width={2} textAlign="right">
                          <span className="post-metadata">
                              {t('post.list.row.post.id', { id: postId })}
                          </span>
                      </Grid.Column>
                  </Grid>
              </List.Header>
              <List.Description>
                  <Grid verticalAlign="middle">
                      <Grid.Column floated="left" width={14}>
                          {postAuthor !== null && timeAgo !== null
                            ? t('post.list.row.author.date', { author: postAuthor, timeAgo })
                            : <Placeholder><Placeholder.Line length="long" /></Placeholder>}
                      </Grid.Column>
                  </Grid>
              </List.Description>
          </List.Content>
          <List.Content>
              {postMessage}
          </List.Content>
      </Dimmer.Dimmable>
  ), [loading, postAuthor, postAuthorMeta, postId, postMessage, postSubject, t, timeAgo]);
};

PostListRow.defaultProps = {
  loading: false,
};

PostListRow.propTypes = {
  id: PropTypes.number.isRequired,
  postCallHash: PropTypes.string,
  loading: PropTypes.bool,
};

export default memo(PostListRow);
