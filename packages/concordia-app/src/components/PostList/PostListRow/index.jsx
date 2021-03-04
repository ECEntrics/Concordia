import React, {
  memo, useEffect, useMemo, useState, useCallback,
} from 'react';
import {
  Dimmer, Feed, Icon, Placeholder, Ref, TextArea,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { POSTS_DATABASE, USER_DATABASE } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze, drizzle } from '../../../redux/store';
import determineKVAddress from '../../../utils/orbitUtils';
import { POST_CONTENT } from '../../../constants/orbit/PostsDatabaseKeys';
import ProfileImage from '../../ProfileImage';
import PostVoting from '../PostVoting';
import targetBlank from '../../../utils/markdownUtils';
import './styles.css';

const { orbit } = breeze;

const { contracts: { [FORUM_CONTRACT]: { methods: { getPost: { clearCacheCall: clearGetPostChainData } } } } } = drizzle;

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
  const [editing, setEditing] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState(null);
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

  // ---------- Post Editing -----------------

  const editPost = useCallback(() => {
    setEditedPostContent(postContent);
    setEditing(true);
  }, [postContent]);

  const discardChanges = useCallback(() => {
    setEditing(false);
  }, []);

  const saveChanges = useCallback(() => {
    setEditing(false);
    if (editedPostContent !== postContent) {
      const { stores } = orbit;
      const postsDb = Object.values(stores).find((store) => store.dbname === POSTS_DATABASE);
      postsDb
        .put(postId, {
          [POST_CONTENT]: editedPostContent,
        })
        .then(() => {
          setPostContent(editedPostContent);
        })
        .catch((reason) => {
          console.error(reason);
        });
    }
  }, [editedPostContent, postContent, postId]);

  const editPostButtons = useMemo(() => {
    if (postContent !== null && userAddress === postAuthorAddress) {
      if (editing) {
        return (
            <>
                <Icon
                  className="post-list-edit-button"
                  name="check"
                  color="green"
                  fitted
                  onClick={saveChanges}
                />
                <Icon
                  className="post-list-edit-button"
                  name="x"
                  color="red"
                  fitted
                  onClick={discardChanges}
                />
            </>
        );
      }
      return (
          <Icon
            className="post-list-edit-button"
            name="pencil"
            fitted
            onClick={editPost}
          />
      );
    }
    return null;
  }, [discardChanges, editPost, editing, postAuthorAddress, postContent, saveChanges, userAddress]);

  const postContentArea = useMemo(() => {
    const handleInputChange = (event, { value }) => {
      setEditedPostContent(value);
    };

    if (postContent !== null) {
      if (!editing) {
        return (
            <ReactMarkdown
              source={postContent}
              renderers={{
                link: targetBlank(),
                linkReference: targetBlank(),
              }}
            />
        );
      }
      return (
          <TextArea
            value={editedPostContent}
            onChange={handleInputChange}
          />
      );
    }
    return (<Placeholder><Placeholder.Line length="long" /></Placeholder>);
  }, [editedPostContent, editing, postContent]);

  useEffect(() => () => clearGetPostChainData(postId), [postId]);

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
                    profileAddress={postAuthorAddress}
                    profileUsername={postAuthor}
                    profileUserMeta={postAuthorMeta}
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
                            {editPostButtons}
                        </>
                    )
                    : <Placeholder><Placeholder.Line length="medium" /></Placeholder>}
              </Feed.Summary>
              <Feed.Extra>
                  {postContentArea}
              </Feed.Extra>
              <PostVoting postId={postId} postAuthorAddress={postAuthorAddress} />
          </Feed.Content>
      </Dimmer.Dimmable>
  ), [editPostButtons, focusRef, loading, postAuthor, postAuthorAddress, postAuthorMeta,
    postContentArea, postId, postIndex, t, timeAgo, topicId]);
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
