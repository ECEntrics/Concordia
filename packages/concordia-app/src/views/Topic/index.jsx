import React from 'react';
import { useRouteMatch } from 'react-router';
import TopicCreate from './TopicCreate';
import TopicView from './TopicView';

const Topic = () => {
  const match = useRouteMatch();
  const { id: topicId } = match.params;

  return topicId === 'new'
    ? (
        <TopicCreate />
    )
    : (
        <TopicView topicId={topicId} />
    );
};

export default Topic;
