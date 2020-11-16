import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Dimmer, Icon, Image, Feed, Placeholder,
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
      <Dimmer.Dimmable as={Feed.Event} blurring dimmed={loading}>
          <Feed.Label className="post-profile-picture">
              {postAuthorMeta !== null && postAuthorMeta[PROFILE_PICTURE]
                ? (
                    <Image
                      avatar
                      src={postAuthorMeta[PROFILE_PICTURE]}
                    />
                )
                : (
                    <Icon
                      name="user circle"
                      size="big"
                      inverted
                      color="black"
                      verticalAlign="middle"
                    />
                )}
          </Feed.Label>
          <Feed.Content>
              <Feed.Summary>
                  <div>
                      {postSubject !== null
                        ? postSubject
                        : <Placeholder><Placeholder.Line length="very long" /></Placeholder>}
                      <span className="post-summary-meta-index">
                          {t('post.list.row.post.id', { id: postId })}
                      </span>
                  </div>
                  {postAuthor !== null && timeAgo !== null
                    ? (
                        <>
                            {t('post.list.row.author.pre')}
                            &nbsp;
                            <Feed.User>{postAuthor}</Feed.User>
                            <Feed.Date className="post-summary-meta-date">{timeAgo}</Feed.Date>
                        </>
                    )
                    : <Placeholder><Placeholder.Line length="medium" /></Placeholder>}
              </Feed.Summary>
              <Feed.Extra>
                  {postMessage}
              </Feed.Extra>
          </Feed.Content>
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
