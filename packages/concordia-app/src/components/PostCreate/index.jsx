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
import { POSTS_DATABASE, USER_DATABASE } from '../../constants/OrbitDatabases';
import { FETCH_USER_DATABASE } from '../../redux/actions/peerDbReplicationActions';
import { USER_PROFILE_PICTURE } from '../../constants/UserDatabaseKeys';
import { breeze, drizzle } from '../../redux/store';
import './styles.css';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../constants/TransactionStatus';
import { POST_CONTENT, POST_SUBJECT } from '../../constants/PostsDatabaseKeys';

const { contracts: { Forum: { methods: { createPost } } } } = drizzle;
const { orbit } = breeze;

const PostCreate = (props) => {
  const {
    topicId, postIndexInTopic, initialPostSubject, account,
  } = props;
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [postSubject, setPostSubject] = useState(initialPostSubject);
  const [postContent, setPostContent] = useState('');
  const [userProfilePictureUrl, setUserProfilePictureUrl] = useState();
  const [postSubjectInputEmptySubmit, setPostSubjectInputEmptySubmit] = useState(false);
  const [postContentInputEmptySubmit, setPostContentInputEmptySubmit] = useState(false);
  const [createPostCacheSendStackId, setCreatePostCacheSendStackId] = useState('');
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

  useEffect(() => {
    if (posting && transactionStack && transactionStack[createPostCacheSendStackId]
            && transactions[transactionStack[createPostCacheSendStackId]]) {
      if (transactions[transactionStack[createPostCacheSendStackId]].status === TRANSACTION_ERROR) {
        setPosting(false);
      } else if (transactions[transactionStack[createPostCacheSendStackId]].status === TRANSACTION_SUCCESS) {
        const {
          receipt: { events: { PostCreated: { returnValues: { postID: contractPostId } } } },
        } = transactions[transactionStack[createPostCacheSendStackId]];

        const { stores } = orbit;
        const postsDb = Object.values(stores).find((store) => store.dbname === POSTS_DATABASE);

        postsDb
          .put(contractPostId, {
            [POST_SUBJECT]: postSubject,
            [POST_CONTENT]: postContent,
          }, { pin: true })
          .then(() => {
            setPostSubject(initialPostSubject);
            setPostContent('');
          })
          .catch((reason) => {
            console.log(reason);
          });
      }
    }
  }, [
    createPostCacheSendStackId, initialPostSubject, postContent, postSubject, posting, transactionStack, transactions,
  ]);

  const savePost = useCallback(() => {
    if (postSubject === '') {
      setPostSubjectInputEmptySubmit(true);
      return;
    }

    if (postContent === '') {
      setPostContentInputEmptySubmit(true);
      return;
    }

    setPosting(true);
    setCreatePostCacheSendStackId(createPost.cacheSend(...[topicId], { from: account }));
  }, [account, postContent, postSubject, topicId]);

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
                            error={postSubjectInputEmptySubmit}
                            value={postSubject}
                            onChange={handleInputChange}
                          />
                          <span className="post-summary-meta-index">
                              {t('post.list.row.post.id', { id: postIndexInTopic })}
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
                            error={postContentInputEmptySubmit}
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
                            disabled={posting || postSubject === '' || postContent === ''}
                            onClick={savePost}
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
  topicId: PropTypes.number.isRequired,
  postIndexInTopic: PropTypes.number.isRequired,
  initialPostSubject: PropTypes.string.isRequired,
};

export default memo(PostCreate);
