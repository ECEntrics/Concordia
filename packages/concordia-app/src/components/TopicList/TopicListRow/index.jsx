import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Dimmer, Grid, Icon, Item, List, Placeholder, Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TimeAgo from 'react-timeago';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { TOPICS_DATABASE, USER_DATABASE } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import ProfileImage from '../../ProfileImage';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import './styles.css';
import determineKVAddress from '../../../utils/orbitUtils';
import { TOPIC_SUBJECT } from '../../../constants/orbit/TopicsDatabaseKeys';

const { orbit } = breeze;

const TopicListRow = (props) => {
  const { id: topicId, topicCallHash, loading } = props;
  const getTopicResults = useSelector((state) => state.contracts[FORUM_CONTRACT].getTopic);
  const [numberOfReplies, setNumberOfReplies] = useState(null);
  const [topicAuthorAddress, setTopicAuthorAddress] = useState(null);
  const [topicAuthor, setTopicAuthor] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const [topicSubject, setTopicSubject] = useState(null);
  const [topicAuthorMeta, setTopicAuthorMeta] = useState(null);
  const userAddress = useSelector((state) => state.user.address);
  const topics = useSelector((state) => state.orbitData.topics);
  const users = useSelector((state) => state.orbitData.users);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && topicCallHash && getTopicResults[topicCallHash] !== undefined) {
      setTopicAuthorAddress(getTopicResults[topicCallHash].value[0]);
      setTopicAuthor(getTopicResults[topicCallHash].value[1]);
      setTimeAgo(getTopicResults[topicCallHash].value[2] * 1000);
      setNumberOfReplies(getTopicResults[topicCallHash].value[3].length - 1);
    }
  }, [getTopicResults, loading, topicCallHash]);

  useEffect(() => {
    if (topicAuthorAddress && userAddress !== topicAuthorAddress) {
      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        dbName: TOPICS_DATABASE,
        userAddress: topicAuthorAddress,
      });

      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        dbName: USER_DATABASE,
        userAddress: topicAuthorAddress,
      });
    }
  }, [dispatch, topicAuthorAddress, userAddress]);

  useEffect(() => {
    const topicFound = topics
      .find((topic) => topic.id === topicId);

    if (topicFound) {
      setTopicSubject(topicFound[TOPIC_SUBJECT]);
    }
  }, [topicId, topics]);

  useEffect(() => {
    if (topicAuthorAddress !== null) {
      determineKVAddress({ orbit, dbName: USER_DATABASE, userAddress: topicAuthorAddress })
        .then((userOrbitAddress) => {
          const userFound = users
            .find((user) => user.id === userOrbitAddress);

          if (userFound) {
            setTopicAuthorMeta(userFound);
          }
        })
        .catch((error) => {
          console.error('Error during determination of key-value DB address:', error);
        });
    }
  }, [topicAuthorAddress, users]);

  const stopClickPropagation = (event) => {
    event.stopPropagation();
  };

  return useMemo(() => {
    const handleTopicClick = () => {
      history.push(`/topics/${topicId}`);
    };
    return (
        <Dimmer.Dimmable as={List.Item} blurring dimmed={loading} className="topic-row" onClick={handleTopicClick}>
            <Segment className="topic-row-segment">
                <Grid columns={2}>
                    <Grid.Column width={1} className="topic-row-avatar">
                        <Item>
                            <ProfileImage
                              profileAddress={topicAuthorAddress}
                              profileUsername={topicAuthor}
                              profileUserMeta={topicAuthorMeta}
                              size="65"
                              link
                            />
                        </Item>
                    </Grid.Column>
                    <Grid.Column width={15} className="topic-row-content">
                        <Grid verticalAlign="middle" columns={2}>
                            <Grid.Row>
                                <Grid.Column floated="left" width={14} className="topic-row-subject">
                                    {topicSubject !== null
                                      ? topicSubject
                                      : <Placeholder><Placeholder.Line length="very long" /></Placeholder>}
                                </Grid.Column>
                                <Grid.Column floated="right" width={2} textAlign="right">
                                    <span className="topic-row-metadata">
                                        {t('topic.list.row.topic.id', { id: topicId })}
                                    </span>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column floated="left" width={14}>
                                    {topicAuthor !== null && timeAgo !== null
                                      ? (
                                          <div>
                                              <TimeAgo date={timeAgo} />
                                                  &nbsp;•&nbsp;
                                              <Link to={`/users/${topicAuthorAddress}`} onClick={stopClickPropagation}>
                                                  {topicAuthor}
                                              </Link>
                                          </div>
                                      )
                                      : <Placeholder><Placeholder.Line length="long" /></Placeholder>}
                                </Grid.Column>
                                <Grid.Column floated="right" width={2} textAlign="right">
                                    {numberOfReplies !== null
                                      ? (
                                          <span className="topic-row-metadata">
                                              <Icon name="reply" fitted />
                                              &nbsp;
                                              { numberOfReplies }
                                          </span>
                                      )
                                      : (
                                          <Placeholder fluid className="replies-placeholder">
                                              <Placeholder.Line />
                                          </Placeholder>
                                      )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Dimmer.Dimmable>
    );
  }, [history, loading, numberOfReplies, t, timeAgo, topicAuthor, topicAuthorAddress, topicAuthorMeta, topicId, topicSubject]);
};

TopicListRow.defaultProps = {
  loading: false,
};

TopicListRow.propTypes = {
  id: PropTypes.number.isRequired,
  topicCallHash: PropTypes.string,
  loading: PropTypes.bool,
};

export default memo(TopicListRow);
