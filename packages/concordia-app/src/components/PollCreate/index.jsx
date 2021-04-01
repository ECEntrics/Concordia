import React, {
  useMemo, useState, useCallback, useEffect, forwardRef, useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button, Checkbox, Form, Icon, Input,
} from 'semantic-ui-react';
import { VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { POLL_CREATED_EVENT } from 'concordia-shared/src/constants/contracts/events/VotingContractEvents';
import { POLLS_DATABASE } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import PollOption from './PollOption';
import { breeze, drizzle } from '../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../constants/TransactionStatus';
import './styles.css';
import { POLL_OPTIONS, POLL_QUESTION } from '../../constants/orbit/PollsDatabaseKeys';
import { generatePollHash } from '../../utils/hashUtils';

const { contracts: { [VOTING_CONTRACT]: { methods: { createPoll } } } } = drizzle;
const { orbit: { stores } } = breeze;

const PollCreate = forwardRef((props, ref) => {
  const { account, onChange, onCreated } = props;
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [createPollCacheSendStackId, setCreatePollCacheSendStackId] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(
    [{ id: 1 }, { id: 2 }],
  );
  const [optionValues, setOptionValues] = useState(
    ['', ''],
  );
  const [optionsNextId, setOptionsNextId] = useState(3);
  const [allowVoteChanges, setAllowVoteChanges] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errored, setErrored] = useState(false);
  const { t } = useTranslation();

  const handlePollQuestionChange = useCallback((event) => {
    const newQuestion = event.target.value.trim();
    if (newQuestion !== question) setQuestion(newQuestion);
  }, [question]);

  const addOption = useCallback((e) => {
    e.currentTarget.blur();
    const newOptions = [...options, { id: optionsNextId, removable: true }];
    const newOptionValues = [...optionValues, ''];
    setOptionsNextId(optionsNextId + 1);
    setOptions(newOptions);
    setOptionValues(newOptionValues);
  }, [optionValues, options, optionsNextId]);

  const removeOption = useCallback((e, id) => {
    e.currentTarget.blur();
    const newOptions = [...options];
    newOptions.splice(id - 1, 1);
    const newOptionValues = [...optionValues];
    newOptionValues.splice(id - 1, 1);
    setOptions(newOptions);
    setOptionValues(newOptionValues);
  }, [optionValues, options]);

  const handlePollOptionChange = useCallback((event, id) => {
    const newValue = event.target.value.trim();
    if (newValue !== optionValues[id - 1]) {
      const newOptionValues = [...optionValues];
      newOptionValues[id - 1] = newValue;
      setOptionValues(newOptionValues);
    }
  }, [optionValues]);

  const pollOptions = useMemo(() => options
    .map((option, index) => {
      const { id, removable } = option;
      return (
          <PollOption
            id={index + 1}
            key={id}
            removable={removable}
            onRemove={removeOption}
            onChange={handlePollOptionChange}
          />
      );
    }), [handlePollOptionChange, options, removeOption]);

  useEffect(() => {
    onChange({ question, optionValues });
  }, [onChange, optionValues, question]);

  const handleCheckboxChange = useCallback((event, data) => {
    setAllowVoteChanges(data.checked);
  }, []);

  useImperativeHandle(ref, () => ({
    createPoll(topicId) {
      setCreating(true);
      const dataHash = generatePollHash(question, optionValues);
      setCreatePollCacheSendStackId(createPoll.cacheSend(
        ...[topicId, options.length, dataHash, allowVoteChanges], { from: account },
      ));
    },
    pollCreating() {
      return creating;
    },
    pollErrored() {
      return errored;
    },
  }));

  useEffect(() => {
    if (creating && transactionStack && transactionStack[createPollCacheSendStackId]
      && transactions[transactionStack[createPollCacheSendStackId]]) {
      if (transactions[transactionStack[createPollCacheSendStackId]].status === TRANSACTION_ERROR) {
        setErrored(true);
        setCreating(false);
        onCreated(false);
      } else if (transactions[transactionStack[createPollCacheSendStackId]].status === TRANSACTION_SUCCESS) {
        const {
          receipt: {
            events: {
              [POLL_CREATED_EVENT]: {
                returnValues: {
                  topicID: topicId,
                },
              },
            },
          },
        } = transactions[transactionStack[createPollCacheSendStackId]];

        const pollsDb = Object.values(stores).find((store) => store.dbname === POLLS_DATABASE);

        pollsDb
          .put(topicId, { [POLL_QUESTION]: question, [POLL_OPTIONS]: optionValues })
          .then(() => {
            onCreated(topicId);
          })
          .catch((reason) => {
            console.error(reason);
            setErrored(true);
            setCreating(false);
            onCreated(false);
          });
      }
    }
  }, [createPollCacheSendStackId, creating, onCreated, optionValues, question, transactionStack, transactions]);

  return useMemo(() => (
      <div className="poll-create">
          <Form.Field required>
              <label className="form-topic-create-header" htmlFor="form-poll-create-field-subject">
                  {t('poll.create.question.field.label')}
              </label>
              <Input
                id="form-poll-create-field-subject"
                placeholder={t('poll.create.question.field.placeholder')}
                name="pollQuestionInput"
                className="form-input"
                onChange={handlePollQuestionChange}
              />
          </Form.Field>
          <Form.Field>
              <Checkbox
                label={t('poll.create.allow.vote.changes.field.label')}
                onClick={handleCheckboxChange}
              />
          </Form.Field>
          {pollOptions}
          <Button
            id="add-option-button"
            key="form-add-option-button"
            positive
            icon
            labelPosition="left"
            onClick={addOption}
          >
              <Icon name="plus" />
              {t('poll.create.add.option.button')}
          </Button>
      </div>
  ), [addOption, handleCheckboxChange, handlePollQuestionChange, pollOptions, t]);
});

PollCreate.propTypes = {
  onChange: PropTypes.func,
  onCreated: PropTypes.func,
};

export default PollCreate;
