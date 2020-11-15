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

const PostListRow = (props) => {
  const { id: postId, postCallHash, loading } = props;
  const getPostResults = useSelector((state) => state.contracts.Forum.getPost);
  const [postAuthorAddress, setPostAuthorAddress] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const [postSubject, setPostSubject] = useState(null);
  const [postMessage, setPostMessage] = useState(null);
  const userAddress = useSelector((state) => state.user.address);
  const posts = useSelector((state) => state.orbitData.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && postCallHash && getPostResults[postCallHash] !== undefined) {
      setPostAuthorAddress(getPostResults[postCallHash].value[0]);
      setPostAuthor(getPostResults[postCallHash].value[1]);
      setTimeAgo(moment(getPostResults[postCallHash].value[2] * 1000).fromNow());
    }
  }, [getPostResults, loading, postCallHash]);

  useEffect(() => {
    if (postAuthorAddress && userAddress !== postAuthorAddress) {
      dispatch({
        type: FETCH_USER_DATABASE,
        orbit,
        dbName: 'posts',
        userAddress: postAuthorAddress,
      });
    }
  }, [dispatch, postAuthorAddress, userAddress]);

  useEffect(() => {
    const postFound = posts
      .find((post) => post.id === postId);

    if (postFound) {
      setPostSubject(postFound.subject);
      setPostMessage(postFound.message);
    }
  }, [postId, posts]);

  return useMemo(() => (
      <Dimmer.Dimmable as={List.Item} blurring dimmed={loading} className="list-item">
          <List.Icon name="user circle" size="big" inverted color="black" verticalAlign="middle" />
          <List.Content>
              <List.Header>
                  <Grid>
                      <Grid.Column floated="left" width={14}>
                          {postSubject !== null
                            ? postSubject
                            : <Placeholder><Placeholder.Line length="very long" /></Placeholder>}
                      </Grid.Column>
                      <Grid.Column floated="right" width={2} textAlign="right">
                          <span className="post-metadata">
                              {t('post.list.row.post.id', { id: postId })}
                          </span>
                      </Grid.Column>
                  </Grid>
              </List.Header>
              <List.Description>
                  <Grid verticalAlign="middle">
                      <Grid.Column floated="left" width={14}>
                          {postAuthor !== null && timeAgo !== null
                            ? t('post.list.row.author.date', { author: postAuthor, timeAgo })
                            : <Placeholder><Placeholder.Line length="long" /></Placeholder>}
                      </Grid.Column>
                  </Grid>
              </List.Description>
          </List.Content>
      </Dimmer.Dimmable>
  ), [loading, postAuthor, postId, postSubject, t, timeAgo]);
};

PostListRow.defaultProps = {
  loading: false,
};

PostListRow.propTypes = {
  id: PropTypes.number.isRequired,
  postCallHash: PropTypes.string,
  loading: PropTypes.bool,
};

export default memo(PostListRow);
