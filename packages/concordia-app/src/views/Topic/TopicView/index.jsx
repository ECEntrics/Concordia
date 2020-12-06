import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Dimmer, Icon, Image, Placeholder, Step,
} from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { breeze, drizzle } from '../../../redux/store';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import './styles.css';
import PostList from '../../../components/PostList';
import { TOPICS_DATABASE, USER_DATABASE } from '../../../constants/orbit/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { USER_PROFILE_PICTURE } from '../../../constants/orbit/UserDatabaseKeys';
import { TOPIC_SUBJECT } from '../../../constants/orbit/TopicsDatabaseKeys';
import PostCreate from '../../../components/PostCreate';
import { FORUM_CONTRACT } from '../../../constants/contracts/ContractNames';

const { contracts: { [FORUM_CONTRACT]: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;
const { orbit } = breeze;

const TopicView = (props) => {
  const {
    topicId, topicAuthorAddress: initialTopicAuthorAddress, topicAuthor: initialTopicAuthor,
    timestamp: initialTimestamp, postIds: initialPostIds,
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
  const [topicAuthorMeta, setTopicAuthorMeta] = useState(null);
  const [timestamp, setTimestamp] = useState(initialTimestamp || null);
  const [postIds, setPostIds] = useState(initialPostIds || null);
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
      setTimestamp(getTopicResults[getTopicCallHash].value[2]);
      setPostIds(getTopicResults[getTopicCallHash].value[3].map((postId) => parseInt(postId, 10)));

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

          if (userFound) {
            setTopicAuthorMeta(userFound);
          } else {
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

  return (
      <Container id="topic-container" textAlign="center">
          <Dimmer.Dimmable
            blurring
            dimmed={topicAuthorAddress === null && topicAuthor === null && timestamp === null}
          >
              <Step.Group fluid>
                  <Step key="topic-header-step-user">
                      <Link to={`/users/${topicAuthorAddress}`}>
                          {topicAuthorMeta !== null && topicAuthorMeta[USER_PROFILE_PICTURE]
                            ? (
                                <Image
                                  avatar
                                  src={topicAuthorMeta[USER_PROFILE_PICTURE]}
                                />
                            )
                            : (
                                <Icon
                                  name="user circle"
                                  size="big"
                                  inverted
                                  color="black"
                                />
                            )}
                      </Link>
                      <Step.Content>
                          <Step.Title>
                              <Link to={`/users/${topicAuthorAddress}`}>
                                  {topicAuthor || (
                                      <Placeholder id="author-placeholder" inverted>
                                          <Placeholder.Line length="full" />
                                      </Placeholder>
                                  )}
                              </Link>
                          </Step.Title>
                      </Step.Content>
                  </Step>
                  <Step key="topic-header-step-title">
                      <Step.Content>
                          <Step.Title>
                              {topicSubject || (
                                  <Placeholder id="subject-placeholder">
                                      <Placeholder.Line length="full" />
                                  </Placeholder>
                              )}
                          </Step.Title>
                          <Step.Description>
                              {timestamp
                                ? moment(timestamp * 1000).fromNow()
                                : (
                                    <Placeholder id="date-placeholder">
                                        <Placeholder.Line length="full" />
                                    </Placeholder>
                                )}
                          </Step.Description>
                      </Step.Content>
                  </Step>
              </Step.Group>
          </Dimmer.Dimmable>
          <PostList postIds={postIds || []} loading={postIds === null} />
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
};

export default TopicView;
