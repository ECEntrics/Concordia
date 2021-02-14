import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  Button, Container, Form, Header, Icon, Input, TextArea,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { TOPIC_CREATED_EVENT } from 'concordia-shared/src/constants/contracts/events/ForumContractEvents';
import { POSTS_DATABASE, TOPICS_DATABASE } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import { drizzle, breeze } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';
import { TOPIC_SUBJECT } from '../../../constants/orbit/TopicsDatabaseKeys';
import { POST_CONTENT } from '../../../constants/orbit/PostsDatabaseKeys';
import './styles.css';

const { contracts: { [FORUM_CONTRACT]: { methods: { createTopic } } } } = drizzle;
const { orbit: { stores } } = breeze;

const TopicCreate = (props) => {
  const { account } = props;
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [subjectInput, setSubjectInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [createTopicCacheSendStackId, setCreateTopicCacheSendStackId] = useState('');
  const [posting, setPosting] = useState(false);

  const history = useHistory();
  const { t } = useTranslation();

  const handleSubjectInputChange = useCallback((event) => {
    if (posting) {
      return;
    }

    switch (event.target.name) {
      case 'subjectInput':
        setSubjectInput(event.target.value);
        break;
      case 'contentInput':
        setContentInput(event.target.value);
        break;
      default:
        break;
    }
  }, [posting]);

  useEffect(() => {
    if (posting && transactionStack && transactionStack[createTopicCacheSendStackId]
            && transactions[transactionStack[createTopicCacheSendStackId]]) {
      if (transactions[transactionStack[createTopicCacheSendStackId]].status === TRANSACTION_ERROR) {
        setPosting(false);
      } else if (transactions[transactionStack[createTopicCacheSendStackId]].status === TRANSACTION_SUCCESS) {
        const {
          receipt: {
            events: {
              [TOPIC_CREATED_EVENT]: {
                returnValues: {
                  topicID: topicId,
                  postID: postId,
                },
              },
            },
          },
        } = transactions[transactionStack[createTopicCacheSendStackId]];

        const topicsDb = Object.values(stores).find((store) => store.dbname === TOPICS_DATABASE);
        const postsDb = Object.values(stores).find((store) => store.dbname === POSTS_DATABASE);

        topicsDb
          .put(topicId, { [TOPIC_SUBJECT]: subjectInput })
          .then(() => postsDb
            .put(postId, {
              [POST_CONTENT]: contentInput,
            }))
          .then(() => {
            history.push(`/topics/${topicId}`);
          })
          .catch((reason) => {
            console.error(reason);
          });
      }
    }
  }, [createTopicCacheSendStackId, history, contentInput, posting, subjectInput, transactionStack, transactions]);

  const validateAndPost = useCallback(() => {
    if (subjectInput === '' || contentInput === '') {
      return;
    }

    setPosting(true);
    setCreateTopicCacheSendStackId(createTopic.cacheSend(...[], { from: account }));
  }, [account, contentInput, subjectInput]);

  return (
      <Container>
          <Header id="new-topic-header" as="h2">New Topic</Header>
          <Form loading={posting}>
              <Form.Field required>
                  <label htmlFor="form-topic-create-field-subject">
                      {t('topic.create.form.subject.field.label')}
                  </label>
                  <Input
                    id="form-topic-create-field-subject"
                    placeholder={t('topic.create.form.subject.field.placeholder')}
                    name="subjectInput"
                    className="form-input"
                    value={subjectInput}
                    onChange={handleSubjectInputChange}
                  />
              </Form.Field>
              <Form.Field required>
                  <label htmlFor="form-topic-create-field-message">
                      {t('topic.create.form.content.field.label')}
                  </label>
                  <TextArea
                    id="form-topic-create-field-message"
                    name="contentInput"
                    value={contentInput}
                    placeholder={t('topic.create.form.content.field.placeholder')}
                    rows={5}
                    autoheight="true"
                    onChange={handleSubjectInputChange}
                  />
              </Form.Field>
              <Button
                id="create-topic-button"
                animated
                key="form-topic-create-button-submit"
                type="button"
                className="primary-button"
                disabled={posting || subjectInput === '' || contentInput === ''}
                onClick={validateAndPost}
              >
                  <Button.Content visible>
                      {t('topic.create.form.post.button')}
                  </Button.Content>
                  <Button.Content hidden>
                      <Icon name="send" />
                  </Button.Content>
              </Button>

          </Form>
      </Container>
  );
};

export default TopicCreate;
