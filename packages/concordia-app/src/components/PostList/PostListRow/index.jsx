import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Dimmer, Icon, Image, Feed, Placeholder,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import './styles.css';
import { POSTS_DATABASE, USER_DATABASE } from '../../../constants/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { USER_PROFILE_PICTURE } from '../../../constants/UserDatabaseKeys';
import { POST_CONTENT } from '../../../constants/PostsDatabaseKeys';
import { FORUM_CONTRACT } from '../../../constants/ContractNames';

const { orbit } = breeze;

const PostListRow = (props) => {
  const {
    id: postId, postIndexInTopic, postCallHash, loading,
  } = props;
  const getPostResults = useSelector((state) => state.contracts[FORUM_CONTRACT].getPost);
  const [postAuthorAddress, setPostAuthorAddress] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
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

  const authorAvatar = useMemo(() => (postAuthorMeta !== null && postAuthorMeta[USER_PROFILE_PICTURE]
    ? (
        <Image
          avatar
          src={postAuthorMeta[USER_PROFILE_PICTURE]}
        />
    )
    : (
        <Icon
          name="user circle"
          size="big"
          inverted
          color="black"
        />
    )), [postAuthorMeta]);

  const authorAvatarLink = useMemo(() => {
    if (postAuthorAddress) {
      return (
          <Link to={`/users/${postAuthorAddress}`}>
              {authorAvatar}
          </Link>
      );
    }

    return authorAvatar;
  }, [authorAvatar, postAuthorAddress]);

  return useMemo(() => (
      <Dimmer.Dimmable as={Feed.Event} blurring dimmed={loading}>
          <Feed.Label className="post-profile-picture">
              {authorAvatarLink}
          </Feed.Label>
          <Feed.Content>
              <Feed.Summary>
                  <div>
                      <span className="post-summary-meta-index">
                          {t('post.list.row.post.id', { id: postIndexInTopic })}
                      </span>
                  </div>
                  {postAuthor !== null && setPostAuthorAddress !== null && timeAgo !== null
                    ? (
                        <>
                            <Feed.User as={Link} to={`/users/${postAuthorAddress}`}>{postAuthor}</Feed.User>
                            <Feed.Date className="post-summary-meta-date">{timeAgo}</Feed.Date>
                        </>
                    )
                    : <Placeholder><Placeholder.Line length="medium" /></Placeholder>}
              </Feed.Summary>
              <Feed.Extra>
                  {postContent}
              </Feed.Extra>
          </Feed.Content>
      </Dimmer.Dimmable>
  ), [
    authorAvatarLink, loading, postAuthor, postAuthorAddress, postContent, postIndexInTopic, t, timeAgo,
  ]);
};

PostListRow.defaultProps = {
  loading: false,
};

PostListRow.propTypes = {
  id: PropTypes.number.isRequired,
  postIndexInTopic: PropTypes.number.isRequired,
  postCallHash: PropTypes.string,
  loading: PropTypes.bool,
};

export default memo(PostListRow);
