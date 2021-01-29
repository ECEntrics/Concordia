import React, {
  memo, useEffect, useMemo, useState, useCallback,
} from 'react';
import {
  Dimmer, Icon, Image, Feed, Placeholder, Ref,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TimeAgo from 'react-timeago';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import './styles.css';
import { POSTS_DATABASE, USER_DATABASE } from '../../../constants/orbit/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { USER_PROFILE_PICTURE } from '../../../constants/orbit/UserDatabaseKeys';
import { POST_CONTENT } from '../../../constants/orbit/PostsDatabaseKeys';
import { FORUM_CONTRACT } from '../../../constants/contracts/ContractNames';
import ProfileImage from '../../ProfileImage';

const { orbit } = breeze;

const PostListRow = (props) => {
  const {
    id: postId, postIndex, postCallHash, loading, focus,
  } = props;
  const getPostResults = useSelector((state) => state.contracts[FORUM_CONTRACT].getPost);
  const [postAuthorAddress, setPostAuthorAddress] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const [postAuthorMeta, setPostAuthorMeta] = useState(null);
  const userAddress = useSelector((state) => state.user.address);
  const posts = useSelector((state) => state.orbitData.posts);
  const users = useSelector((state) => state.orbitData.users);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && postCallHash && getPostResults[postCallHash] !== undefined) {
      setPostAuthorAddress(getPostResults[postCallHash].value[0]);
      setPostAuthor(getPostResults[postCallHash].value[1]);
      setTimeAgo(getPostResults[postCallHash].value[2] * 1000);
      setTopicId(getPostResults[postCallHash].value[3]);
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
      setPostContent(postFound[POST_CONTENT]);
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

  const focusRef = useCallback((node) => {
    if (focus && node !== null) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, [focus]);

  return useMemo(() => (
      <Dimmer.Dimmable
        as={Feed.Event}
        blurring
        dimmed={loading}
        id={`post-${postId}`}
        className="post-list-row"
      >
          <Ref innerRef={focusRef}>
              <Feed.Label className="post-profile-picture">
                  <ProfileImage
                    topicAuthorAddress={postAuthorAddress}
                    topicAuthor={postAuthor}
                    topicAuthorMeta={postAuthorMeta}
                    size="42"
                    link
                  />
              </Feed.Label>
          </Ref>
          <Feed.Content className="post-content">
              <Feed.Summary>
                  <Link to={`/topics/${topicId}/#post-${postId}`}>
                      <span className="post-summary-meta-index">
                          {t('post.list.row.post.id', { id: postIndex })}
                      </span>
                  </Link>
                  {postAuthor !== null && setPostAuthorAddress !== null && timeAgo !== null
                    ? (
                        <>
                            <Feed.User as={Link} to={`/users/${postAuthorAddress}`}>{postAuthor}</Feed.User>
                            <Feed.Date>
                                <TimeAgo date={timeAgo} />
                            </Feed.Date>
                        </>
                    )
                    : <Placeholder><Placeholder.Line length="medium" /></Placeholder>}
              </Feed.Summary>
              <Feed.Extra>
                  {postContent !== null
                    ? postContent
                    : <Placeholder><Placeholder.Line length="long" /></Placeholder>}
              </Feed.Extra>
          </Feed.Content>
      </Dimmer.Dimmable>
  ), [focusRef, loading, postAuthor, postAuthorAddress, postAuthorMeta, postContent, postId, postIndex, t, timeAgo,
    topicId,
  ]);
};

PostListRow.defaultProps = {
  loading: false,
  focus: false,
};

PostListRow.propTypes = {
  id: PropTypes.number.isRequired,
  postIndex: PropTypes.number.isRequired,
  postCallHash: PropTypes.string,
  loading: PropTypes.bool,
  focus: PropTypes.bool,
};

export default memo(PostListRow);
