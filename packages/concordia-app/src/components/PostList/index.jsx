import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer, Feed, Loader,
} from 'semantic-ui-react';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../redux/store';
import PostListRow from './PostListRow';
import PaginationComponent from '../PaginationComponent';

const { contracts: { [FORUM_CONTRACT]: { methods: { getPost: { cacheCall: getPostChainData } } } } } = drizzle;

const PostList = (props) => {
  const {
    postIds, numberOfItems, onPageChange, loading, focusOnPost,
  } = props;
  const [getPostCallHashes, setGetPostCallHashes] = useState([]);

  useEffect(() => {
    if (!loading) {
      setGetPostCallHashes(
        postIds.map((postId) => ({
          id: postId,
          hash: getPostChainData(postId),
        })),
      );
    }
  }, [loading, postIds]);

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
      <>
          <Dimmer.Dimmable as={Feed} blurring dimmed={loading} id="post-list" size="large">
              <Loader active={loading} />
              {posts}
          </Dimmer.Dimmable>
          <PaginationComponent onPageChange={onPageChange} numberOfItems={numberOfItems} />
      </>
  );
};

PostList.propTypes = {
  postIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool,
  focusOnPost: PropTypes.number,
};

export default PostList;
