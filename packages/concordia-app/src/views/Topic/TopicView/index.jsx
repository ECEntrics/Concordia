import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Dimmer, Icon, Loader, Placeholder, Step,
} from 'semantic-ui-react';
import moment from 'moment';
import { breeze, drizzle } from '../../../redux/store';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import './styles.css';

const { contracts: { Forum: { methods: { getTopic: { cacheCall: getTopicChainData } } } } } = drizzle;
const { orbit } = breeze;

const TopicView = (props) => {
  const {
    topicId, topicAuthorAddress: initialTopicAuthorAddress, topicAuthor: initialTopicAuthor,
    timestamp: initialTimestamp, postIds: initialPostIds,
  } = props;
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
  const userAddress = useSelector((state) => state.user.address);
  const getTopicResults = useSelector((state) => state.contracts.Forum.getTopic);
  const topics = useSelector((state) => state.orbitData.topics);
  const [getTopicCallHash, setGetTopicCallHash] = useState([]);
  const [topicAuthorAddress, setTopicAuthorAddress] = useState(initialTopicAuthorAddress || null);
  const [topicAuthor, setTopicAuthor] = useState(initialTopicAuthor || null);
  const [timestamp, setTimestamp] = useState(initialTimestamp || null);
  const [postIds, setPostIds] = useState(initialPostIds || null);
  const [topicSubject, setTopicSubject] = useState(null);

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
      setTopicAuthorAddress(getTopicResults[getTopicCallHash].value[0]);
      setTopicAuthor(getTopicResults[getTopicCallHash].value[1]);
      setTimestamp(getTopicResults[getTopicCallHash].value[2]);
      setPostIds(getTopicResults[getTopicCallHash].value[3]);

      const topicFound = topics
        .find((topic) => topic.id === topicId);

      if (topicFound === undefined && userAddress !== getTopicResults[getTopicCallHash].value[0]) {
        dispatch({
          type: FETCH_USER_DATABASE,
          orbit,
          userAddress: getTopicResults[getTopicCallHash].value[0],
        });
      }
    }
  }, [dispatch, getTopicCallHash, getTopicResults, topicId, topics, userAddress]);

  useEffect(() => {
    const topicFound = topics
      .find((topic) => topic.id === topicId);

    if (topicFound) {
      setTopicSubject(topicFound.subject);
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
                      <Icon name="user circle" size="big" inverted color="black" />
                      <Step.Content>
                          <Step.Title>
                              {topicAuthor || (
                                  <Placeholder id="author-placeholder" inverted>
                                      <Placeholder.Line length="full" />
                                  </Placeholder>
                              )}
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
