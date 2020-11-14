import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  Button, Container, Form, Icon, Input, TextArea,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import './styles.css';
import { drizzle, breeze } from '../../../redux/store';

const { contracts: { Forum: { methods: { createTopic } } } } = drizzle;
const { orbit: { stores } } = breeze;

const TopicCreate = (props) => {
  const { account } = props;
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [subjectInput, setSubjectInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [topicSubjectInputEmptySubmit, setTopicSubjectInputEmptySubmit] = useState(false);
  const [topicMessageInputEmptySubmit, setTopicMessageInputEmptySubmit] = useState(false);
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
      case 'messageInput':
        setMessageInput(event.target.value);
        break;
      default:
        break;
    }
  }, [posting]);

  useEffect(() => {
    if (posting && transactionStack && transactionStack[createTopicCacheSendStackId]
            && transactions[transactionStack[createTopicCacheSendStackId]]) {
      if (transactions[transactionStack[createTopicCacheSendStackId]].status === 'error') {
        setPosting(false);
      } else if (transactions[transactionStack[createTopicCacheSendStackId]].status === 'success') {
        const {
          receipt: {
            events: {
              TopicCreated: {
                returnValues: {
                  topicID: topicId,
                  postID: postId,
                },
              },
            },
          },
        } = transactions[transactionStack[createTopicCacheSendStackId]];

        const topicsDb = Object.values(stores).find((store) => store.dbname === 'topics');
        const postsDb = Object.values(stores).find((store) => store.dbname === 'posts');

        topicsDb
          .put(topicId, { subject: subjectInput }, { pin: true })
          .then(() => postsDb
            .put(postId, {
              subject: subjectInput,
              content: messageInput,
            }, { pin: true }))
          .then(() => {
            history.push(`/topics/${topicId}`);
          })
          .catch((reason) => {
            console.log(reason);
          });
      }
    }
  }, [
    transactions, transactionStack, history, posting, createTopicCacheSendStackId, subjectInput, messageInput, stores,
  ]);

  const validateAndPost = useCallback(() => {
    if (subjectInput === '') {
      setTopicSubjectInputEmptySubmit(true);
      return;
    }

    if (messageInput === '') {
      setTopicMessageInputEmptySubmit(true);
      return;
    }

    setPosting(true);
    setCreateTopicCacheSendStackId(createTopic.cacheSend(...[], { from: account }));
  }, [account, createTopic, messageInput, subjectInput]);

  return (
      <Container>
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
                    error={topicSubjectInputEmptySubmit}
                    value={subjectInput}
                    onChange={handleSubjectInputChange}
                  />
              </Form.Field>
              <Form.Field required>
                  <label htmlFor="form-topic-create-field-message">
                      {t('topic.create.form.message.field.label')}
                  </label>
                  <TextArea
                    id="form-topic-create-field-message"
                    name="messageInput"
                    className={topicMessageInputEmptySubmit
                      ? 'form-textarea-required'
                      : ''}
                    value={messageInput}
                    placeholder={t('topic.create.form.message.field.placeholder')}
                    rows={5}
                    autoheight="true"
                    onChange={handleSubjectInputChange}
                  />
              </Form.Field>
              <Form.Group>
                  <Form.Button
                    animated
                    key="form-topic-create-button-submit"
                    type="button"
                    color="green"
                    disabled={posting}
                    onClick={validateAndPost}
                  >
                      <Button.Content visible>
                          {t('topic.create.form.post.button')}
                      </Button.Content>
                      <Button.Content hidden>
                          <Icon name="send" />
                      </Button.Content>
                  </Form.Button>
              </Form.Group>
          </Form>
      </Container>
  );
};

export default TopicCreate;
