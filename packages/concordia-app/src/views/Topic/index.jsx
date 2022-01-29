import React from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import TopicCreate from './TopicCreate';
import TopicView from './TopicView';

const Topic = () => {
  const match = useRouteMatch();
  const { id: topicId } = match.params;
  const location = useLocation();
  const postHash = location.hash;
  const postId = postHash ? postHash.substring('#post-'.length) : null;
  const focusPostId = postId ? parseInt(postId, 10) : null;

  return topicId === 'new'
    ? (
        <TopicCreate />
    )
    : (
        <TopicView topicId={parseInt(topicId, 10)} focusOnPost={focusPostId} />
    );
};

export default Topic;
