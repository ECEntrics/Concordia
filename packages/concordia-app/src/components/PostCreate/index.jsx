import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import {
  Button, Feed, Form, Icon, Image, Input, TextArea,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import determineKVAddress from '../../utils/orbitUtils';
import { USER_DATABASE } from '../../constants/OrbitDatabases';
import { FETCH_USER_DATABASE } from '../../redux/actions/peerDbReplicationActions';
import { USER_PROFILE_PICTURE } from '../../constants/UserDatabaseKeys';
import { breeze } from '../../redux/store';
import './styles.css';

const { orbit } = breeze;

const PostCreate = (props) => {
  const { id: postId, initialPostSubject } = props;
  const [postSubject, setPostSubject] = useState(initialPostSubject);
  const [postContent, setPostContent] = useState('');
  const [userProfilePictureUrl, setUserProfilePictureUrl] = useState();
  const [posting, setPosting] = useState(false);
  const userAddress = useSelector((state) => state.user.address);
  const users = useSelector((state) => state.orbitData.users);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (userAddress) {
      determineKVAddress({ orbit, dbName: USER_DATABASE, userAddress })
        .then((userOrbitAddress) => {
          const userFound = users
            .find((user) => user.id === userOrbitAddress);

          if (userFound) {
            setUserProfilePictureUrl(userFound[USER_PROFILE_PICTURE]);
          } else {
            dispatch({
              type: FETCH_USER_DATABASE,
              orbit,
              dbName: USER_DATABASE,
              userAddress,
            });
          }
        })
        .catch((error) => {
          console.error('Error during determination of key-value DB address:', error);
        });
    }
  }, [dispatch, userAddress, users]);

  const handleInputChange = useCallback((event) => {
    if (posting) {
      return;
    }

    switch (event.target.name) {
      case 'postSubject':
        setPostSubject(event.target.value);
        break;
      case 'postContent':
        setPostContent(event.target.value);
        break;
      default:
        break;
    }
  }, [posting]);

  const savePost = useCallback(() => {
    if (postSubject === '' || postContent === '') {
      return;
    }

    setPosting(true);
  }, [postContent, postSubject]);

  return (
      <Feed>
          <Feed.Event>
              <Feed.Label className="post-profile-picture">
                  {userProfilePictureUrl
                    ? (
                        <Image
                          avatar
                          src={userProfilePictureUrl}
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
              </Feed.Label>
              <Feed.Content>
                  <Feed.Summary>
                      <div>
                          <Input
                            placeholder={t('post.form.subject.field.placeholder')}
                            name="postSubject"
                            className="subject-input"
                            size="mini"
                            value={postSubject}
                            onChange={handleInputChange}
                          />
                          <span className="post-summary-meta-index">
                              {t('post.list.row.post.id', { id: postId })}
                          </span>
                      </div>
                  </Feed.Summary>
                  <Feed.Extra>
                      <Form>
                          <TextArea
                            placeholder={t('post.form.content.field.placeholder')}
                            name="postContent"
                            className="content-input"
                            size="mini"
                            rows={4}
                            value={postContent}
                            onChange={handleInputChange}
                          />
                      </Form>
                  </Feed.Extra>

                  <Feed.Meta>
                      <Feed.Like>
                          <Form.Button
                            animated
                            type="button"
                            color="green"
                            disabled={posting}
                            onClick={savePost || postSubject === '' || postContent === ''}
                          >
                              <Button.Content visible>
                                  {t('post.create.form.send.button')}
                              </Button.Content>
                              <Button.Content hidden>
                                  <Icon name="send" />
                              </Button.Content>
                          </Form.Button>
                      </Feed.Like>
                  </Feed.Meta>
              </Feed.Content>
          </Feed.Event>
      </Feed>
  );
};

PostCreate.propTypes = {
  id: PropTypes.number.isRequired,
  initialPostSubject: PropTypes.string.isRequired,
};

export default memo(PostCreate);
