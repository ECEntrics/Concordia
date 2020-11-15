import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Dimmer, Grid, List, Loader, Placeholder,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_USER_DATABASE } from '../../../redux/actions/peerDbReplicationActions';
import { breeze } from '../../../redux/store';
import './styles.css';

const { orbit } = breeze;

const TopicListRow = (props) => {
  const { id: topicId, topicCallHash, loading } = props;
  const getTopicResults = useSelector((state) => state.contracts.Forum.getTopic);
  const [numberOfReplies, setNumberOfReplies] = useState(null);
  const [topicAuthorAddress, setTopicAuthorAddress] = useState(null);
  const [topicAuthor, setTopicAuthor] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const [topicSubject, setTopicSubject] = useState(null);
  const userAddress = useSelector((state) => state.user.address);
  const topics = useSelector((state) => state.orbitData.topics);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && topicCallHash && getTopicResults[topicCallHash] !== undefined) {
      setTopicAuthorAddress(getTopicResults[topicCallHash].value[0]);
      setTopicAuthor(getTopicResults[topicCallHash].value[1]);
      setTimeAgo(moment(getTopicResults[topicCallHash].value[2] * 1000).fromNow());
      setNumberOfReplies(getTopicResults[topicCallHash].value[3].length);
    }
  }, [getTopicResults, loading, topicCallHash]);

  useEffect(() => {
    if (topicAuthorAddress && userAddress !== topicAuthorAddress) {
      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        userAddress: topicAuthorAddress,
      });
    }
  }, [dispatch, topicAuthorAddress, userAddress]);

  useEffect(() => {
    const topicFound = topics
      .find((topic) => topic.id === topicId);

    if (topicFound) {
      setTopicSubject(topicFound.subject);
    }
  }, [topicId, topics]);

  return useMemo(() => {
    const handleTopicClick = () => {
      history.push(`/topics/${topicId}`);
    };

    return (
        <Dimmer.Dimmable as={List.Item} onClick={handleTopicClick} blurring dimmed={loading} className="list-item">
            <Dimmer>
                <Loader />
            </Dimmer>
            <List.Icon name="user circle" size="big" inverted color="black" verticalAlign="middle" />
            <List.Content>
                <List.Header>
                    <Grid>
                        <Grid.Column floated="left" width={14}>
                            {topicSubject !== null
                              ? topicSubject
                              : <Placeholder><Placeholder.Line length="very long" /></Placeholder>}
                        </Grid.Column>
                        <Grid.Column floated="right" width={2} textAlign="right">
                            <span className="topic-metadata">
                                {t('topic.list.row.topic.id', { id: topicId })}
                            </span>
                        </Grid.Column>
                    </Grid>
                </List.Header>
                <List.Description>
                    <Grid verticalAlign="middle">
                        <Grid.Column floated="left" width={14}>
                            {topicAuthor !== null && timeAgo !== null
                              ? t('topic.list.row.author.date', { author: topicAuthor, timeAgo })
                              : <Placeholder><Placeholder.Line length="long" /></Placeholder>}
                        </Grid.Column>
                        <Grid.Column floated="right" width={2} textAlign="right">
                            {numberOfReplies !== null
                              ? (
                                  <span className="topic-metadata">
                                      {t('topic.list.row.number.of.replies', { numberOfReplies })}
                                  </span>
                              )
                              : <Placeholder fluid><Placeholder.Line /></Placeholder>}
                        </Grid.Column>
                    </Grid>
                </List.Description>
            </List.Content>
        </Dimmer.Dimmable>
    );
  }, [history, loading, numberOfReplies, t, timeAgo, topicAuthor, topicId, topicSubject]);
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
