import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Dimmer, List, Loader } from 'semantic-ui-react';
import PostListRow from './PostListRow';
import { drizzle } from '../../redux/store';

const { contracts: { Forum: { methods: { getPost: { cacheCall: getPostChainData } } } } } = drizzle;

const PostList = (props) => {
  const { postIds, loading } = props;
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
      .map((postId) => {
        const postHash = getPostCallHashes.find((getPostCallHash) => getPostCallHash.id === postId);

        return (
            <PostListRow
              id={postId}
              key={postId}
              postCallHash={postHash && postHash.hash}
              loading={postHash === undefined}
            />
        );
      });
  }, [getPostCallHashes, loading, postIds]);

  return (
      <Dimmer.Dimmable as={List} blurring dimmed={loading} selection divided id="post-list" size="big">
          <Loader active={loading} />
          {posts}
      </Dimmer.Dimmable>
  );
};

PostList.propTypes = {
  postIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool,
};

export default PostList;
