import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Dimmer, Grid, Image, Item, List, Placeholder, Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TimeAgo from 'react-timeago';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import './styles.css';
import { TOPICS_DATABASE, USER_DATABASE } from '../../../constants/orbit/OrbitDatabases';
import determineKVAddress from '../../../utils/orbitUtils';
import { USER_PROFILE_PICTURE } from '../../../constants/orbit/UserDatabaseKeys';
import { TOPIC_SUBJECT } from '../../../constants/orbit/TopicsDatabaseKeys';
import { FORUM_CONTRACT } from '../../../constants/contracts/ContractNames';

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
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && topicCallHash && getTopicResults[topicCallHash] !== undefined) {
      setTopicAuthorAddress(getTopicResults[topicCallHash].value[0]);
      setTopicAuthor(getTopicResults[topicCallHash].value[1]);
      setTimeAgo(getTopicResults[topicCallHash].value[2] * 1000);
      setNumberOfReplies(getTopicResults[topicCallHash].value[3].length);
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

  const authorAvatar = useMemo(() => (topicAuthorMeta !== null && topicAuthorMeta[USER_PROFILE_PICTURE]
    ? (
        <Image
          className="profile-picture"
          src={topicAuthorMeta[USER_PROFILE_PICTURE]}
        />
    )
    : (
        <List.Icon
          name="user circle"
          size="big"
          inverted
          color="black"
          verticalAlign="middle"
        />
    )), [topicAuthorMeta]);

  const authorAvatarLink = useMemo(() => {
    if (topicAuthorAddress) {
      return (
          <Link to={`/users/${topicAuthorAddress}`} onClick={stopClickPropagation}>
              {authorAvatar}
          </Link>
      );
    }

    return authorAvatar;
  }, [authorAvatar, topicAuthorAddress]);

  return useMemo(() => (
      <Dimmer.Dimmable as={List.Item} blurring dimmed={loading} className="topic-row">
          <Segment raised className="topic-row-segment" as="a">
              <Grid doubling columns={2}>
                  <Grid.Column width={1} className="topic-row-avatar">
                      <Item>
                          {authorAvatarLink}
                      </Item>
                  </Grid.Column>
                  <Grid.Column width={15} className="topic-row-content">
                      <Link to={`/topics/${topicId}`} onClick={stopClickPropagation}>
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
                                                {t('topic.list.row.number.of.replies', { numberOfReplies })}
                                            </span>
                                        )
                                        : <Placeholder fluid><Placeholder.Line /></Placeholder>}
                                  </Grid.Column>
                              </Grid.Row>
                          </Grid>

                      </Link>
                  </Grid.Column>
              </Grid>

          </Segment>

      </Dimmer.Dimmable>

  ), [authorAvatarLink, loading, numberOfReplies, t, timeAgo, topicAuthor, topicAuthorAddress, topicId, topicSubject]);
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
