import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Dimmer, Feed, Loader } from 'semantic-ui-react';
import PostListRow from './PostListRow';
import { drizzle } from '../../redux/store';
import { FORUM_CONTRACT } from '../../constants/contracts/ContractNames';

const { contracts: { [FORUM_CONTRACT]: { methods: { getPost: { cacheCall: getPostChainData } } } } } = drizzle;

const PostList = (props) => {
  const { postIds, loading, focusOnPost } = props;
  const [getPostCallHashes, setGetPostCallHashes] = useState([]);
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);

  useEffect(() => {
    if (drizzleInitialized && !drizzleInitializationFailed && !loading) {
      const newPostsFound = postIds
        .filter((postId) => !getPostCallHashes
          .map((getPostCallHash) => getPostCallHash.id)
          .includes(postId));

      if (newPostsFound.length > 0) {
        setGetPostCallHashes([
          ...getPostCallHashes,
          ...newPostsFound
            .map((postId) => ({
              id: postId,
              hash: getPostChainData(postId),
            })),
        ]);
      }
    }
  }, [drizzleInitializationFailed, drizzleInitialized, getPostCallHashes, loading, postIds]);

  const posts = useMemo(() => {
    if (loading) {
      return null;
    }
    return postIds
      .map((postId, index) => {
        const postHash = getPostCallHashes.find((getPostCallHash) => getPostCallHash.id === postId);

        return (
            <PostListRow
              id={postId}
              postIndex={index + 1}
              key={postId}
              postCallHash={postHash && postHash.hash}
              loading={postHash === undefined}
              focus={postId === focusOnPost}
            />
        );
      });
  }, [focusOnPost, getPostCallHashes, loading, postIds]);

  return (
      <Dimmer.Dimmable as={Feed} blurring dimmed={loading} id="post-list" size="large">
          <Loader active={loading} />
          {posts}
      </Dimmer.Dimmable>
  );
};

PostList.propTypes = {
  postIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool,
  focusOnPost: PropTypes.number,
};

export default PostList;
