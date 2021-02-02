import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import {
  Button, Feed, Form, Icon, TextArea,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import determineKVAddress from '../../utils/orbitUtils';
import { POSTS_DATABASE, USER_DATABASE } from '../../constants/orbit/OrbitDatabases';
import { FETCH_USER_DATABASE } from '../../redux/actions/peerDbReplicationActions';
import { breeze, drizzle } from '../../redux/store';
import './styles.css';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../constants/TransactionStatus';
import { POST_CONTENT } from '../../constants/orbit/PostsDatabaseKeys';
import { FORUM_CONTRACT } from '../../constants/contracts/ContractNames';
import { POST_CREATED_EVENT } from '../../constants/contracts/events/ForumContractEvents';

const { contracts: { [FORUM_CONTRACT]: { methods: { createPost } } } } = drizzle;
const { orbit } = breeze;

const PostCreate = (props) => {
  const {
    topicId, initialPostSubject, account,
  } = props;
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [postContent, setPostContent] = useState('');
  const [createPostCacheSendStackId, setCreatePostCacheSendStackId] = useState('');
  const [posting, setPosting] = useState(false);
  const [storingPost, setStoringPost] = useState(false);
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

          if (!userFound) {
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
      case 'postContent':
        setPostContent(event.target.value);
        break;
      default:
        break;
    }
  }, [posting]);

  useEffect(() => {
    if (posting && !storingPost && transactionStack && transactionStack[createPostCacheSendStackId]
            && transactions[transactionStack[createPostCacheSendStackId]]) {
      if (transactions[transactionStack[createPostCacheSendStackId]].status === TRANSACTION_ERROR) {
        setPosting(false);
      } else if (transactions[transactionStack[createPostCacheSendStackId]].status === TRANSACTION_SUCCESS) {
        const {
          receipt: { events: { [POST_CREATED_EVENT]: { returnValues: { postID: contractPostId } } } },
        } = transactions[transactionStack[createPostCacheSendStackId]];

        const { stores } = orbit;
        const postsDb = Object.values(stores).find((store) => store.dbname === POSTS_DATABASE);

        postsDb
          .put(contractPostId, {
            [POST_CONTENT]: postContent,
          }, { pin: true })
          .then(() => {
            setPostContent('');
            setPosting(false);
            setStoringPost(false);
            setCreatePostCacheSendStackId('');
          })
          .catch((reason) => {
            console.log(reason);
          });

        setStoringPost(true);
      }
    }
  }, [
    createPostCacheSendStackId, initialPostSubject, postContent, posting, storingPost, transactionStack,
    transactions,
  ]);

  const savePost = useCallback(() => {
    if (postContent === '') {
      return;
    }

    setPosting(true);
    setCreatePostCacheSendStackId(createPost.cacheSend(...[topicId], { from: account }));
  }, [account, postContent, topicId]);

  return (
      <Feed>
          <Feed.Event>
              <Feed.Content>
                  <Feed.Summary>
                      <Form>
                          <TextArea
                            placeholder={t('post.form.content.field.placeholder')}
                            name="postContent"
                            size="mini"
                            rows={4}
                            value={postContent}
                            onChange={handleInputChange}
                          />
                      </Form>
                  </Feed.Summary>
                  <Feed.Meta id="post-button-div">
                      <Feed.Like>
                          <Button
                            animated
                            type="button"
                            className="primary-button"
                            disabled={posting || postContent === ''}
                            onClick={savePost}
                          >
                              <Button.Content visible>
                                  {t('post.create.form.send.button')}
                              </Button.Content>
                              <Button.Content hidden>
                                  <Icon name="send" />
                              </Button.Content>
                          </Button>
                      </Feed.Like>
                  </Feed.Meta>
              </Feed.Content>
          </Feed.Event>
      </Feed>
  );
};

PostCreate.propTypes = {
  topicId: PropTypes.number.isRequired,
};

export default memo(PostCreate);
