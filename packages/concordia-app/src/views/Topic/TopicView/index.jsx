import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Dimmer, Divider, Header, Icon, Placeholder, Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

import { breeze, drizzle } from '../../../redux/store';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import './styles.css';
import PostList from '../../../components/PostList';
import { TOPICS_DATABASE, USER_DATABASE } from '../../../constants/orbit/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { TOPIC_SUBJECT } from '../../../constants/orbit/TopicsDatabaseKeys';
import PostCreate from '../../../components/PostCreate';
import { FORUM_CONTRACT } from '../../../constants/contracts/ContractNames';

const { contracts: { [FORUM_CONTRACT]: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;
const { orbit } = breeze;

const TopicView = (props) => {
  const {
    topicId, topicAuthorAddress: initialTopicAuthorAddress, topicAuthor: initialTopicAuthor,
    timestamp: initialTimestamp, postIds: initialPostIds, focusOnPost,
  } = props;
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
  const userAddress = useSelector((state) => state.user.address);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const getTopicResults = useSelector((state) => state.contracts[FORUM_CONTRACT].getTopic);
  const topics = useSelector((state) => state.orbitData.topics);
  const users = useSelector((state) => state.orbitData.users);
  const [getTopicCallHash, setGetTopicCallHash] = useState([]);
  const [topicAuthorAddress, setTopicAuthorAddress] = useState(initialTopicAuthorAddress || null);
  const [topicAuthor, setTopicAuthor] = useState(initialTopicAuthor || null);
  const [timestamp, setTimestamp] = useState(initialTimestamp || null);
  const [postIds, setPostIds] = useState(initialPostIds || null);
  const [numberOfReplies, setReplyCount] = useState(0);
  const [topicSubject, setTopicSubject] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const shouldGetTopicDataFromChain = topicAuthorAddress === null
        || topicAuthor === null
        || timestamp === null
        || postIds === null;

    if (drizzleInitialized && !drizzleInitializationFailed && shouldGetTopicDataFromChain) {
      setGetTopicCallHash(getTopicChainData(topicId));
    }
  }, [
    drizzleInitializationFailed, drizzleInitialized, postIds, timestamp, topicAuthor, topicAuthorAddress, topicId,
  ]);

  useEffect(() => {
    if (getTopicCallHash && getTopicResults && getTopicResults[getTopicCallHash]) {
      if (getTopicResults[getTopicCallHash].value == null) {
        history.push('/');
        return;
      }

      setTopicAuthorAddress(getTopicResults[getTopicCallHash].value[0]);
      setTopicAuthor(getTopicResults[getTopicCallHash].value[1]);
      setTimestamp(getTopicResults[getTopicCallHash].value[2] * 1000);
      const postIds = getTopicResults[getTopicCallHash].value[3].map((postId) => parseInt(postId, 10));
      setPostIds(postIds);
      setReplyCount(postIds.length - 1);

      const topicFound = topics
        .find((topic) => topic.id === topicId);

      if (topicFound === undefined && userAddress !== getTopicResults[getTopicCallHash].value[0]) {
        dispatch({
          type: FETCH_USER_DATABASE,
          orbit,
          dbName: TOPICS_DATABASE,
          userAddress: getTopicResults[getTopicCallHash].value[0],
        });
      }
    }
  }, [dispatch, getTopicCallHash, getTopicResults, history, topicId, topics, userAddress]);

  useEffect(() => {
    if (topicAuthorAddress !== null) {
      determineKVAddress({ orbit, dbName: USER_DATABASE, userAddress: topicAuthorAddress })
        .then((userOrbitAddress) => {
          const userFound = users
            .find((user) => user.id === userOrbitAddress);

          if (!userFound) {
            dispatch({
              type: FETCH_USER_DATABASE,
              orbit,
              dbName: USER_DATABASE,
              userAddress: topicAuthorAddress,
            });
          }
        })
        .catch((error) => {
          console.error('Error during determination of key-value DB address:', error);
        });
    }
  }, [dispatch, topicAuthorAddress, users]);

  useEffect(() => {
    const topicFound = topics
      .find((topic) => topic.id === topicId);

    if (topicFound) {
      setTopicSubject(topicFound[TOPIC_SUBJECT]);
    }
  }, [topicId, topics]);

  const stopClickPropagation = (event) => {
    event.stopPropagation();
  };

  return (
      <Container id="topic-container" textAlign="center">
          <Segment>
              <Dimmer.Dimmable
                blurring
                dimmed={topicAuthorAddress === null && topicAuthor === null && timestamp === null}
              >
                  <div id="topic-header">
                      <Header as="h2">
                          {topicSubject || (
                              <Placeholder id="subject-placeholder">
                                  <Placeholder.Line />
                              </Placeholder>
                          )}
                      </Header>

                      <div id="topic-metadata">
                          <Icon name="calendar alternate" fitted />
                    &nbsp;
                          {new Date(timestamp).toLocaleString('el-gr', { hour12: false })}
                    &nbsp;&nbsp;&nbsp;
                          <Icon name="user" fitted />
                    &nbsp;
                          <Link to={`/users/${topicAuthorAddress}`} onClick={stopClickPropagation}>{ topicAuthor }</Link>
                    &nbsp;&nbsp;&nbsp;
                          <Icon name="reply" fitted />
                    &nbsp;
                          { numberOfReplies }
                      </div>
                  </div>
                  <Divider />
              </Dimmer.Dimmable>
              <PostList postIds={postIds || []} loading={postIds === null} focusOnPost={focusOnPost} />
          </Segment>

          {topicSubject !== null && postIds !== null && hasSignedUp && (
              <PostCreate
                topicId={topicId}
                postIndexInTopic={postIds.length + 1}
                initialPostSubject={topicSubject}
              />
          )}
      </Container>
  );
};

TopicView.propTypes = {
  topicId: PropTypes.number.isRequired,
  topicAuthorAddress: PropTypes.string,
  topicAuthor: PropTypes.string,
  timestamp: PropTypes.number,
  postIds: PropTypes.arrayOf(PropTypes.number),
  focusOnPost: PropTypes.number,
};

export default TopicView;
