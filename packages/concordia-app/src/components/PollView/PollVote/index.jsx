import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';
import './styles.css';

const { contracts: { [VOTING_CONTRACT]: { methods: { vote } } } } = drizzle;

const PollVote = (props) => {
  const {
    topicId, account, pollOptions, enableVoteChanges, hasUserVoted, userVoteIndex,
  } = props;
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [voteCacheSendStackId, setVoteCacheSendStackId] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(userVoteIndex);
  const [voting, setVoting] = useState(false);
  const { t } = useTranslation();

  const onOptionSelected = (e, { value }) => {
    setSelectedOptionIndex(value);
  };

  useEffect(() => {
    setSelectedOptionIndex(userVoteIndex);
  }, [userVoteIndex]);

  const onCastVote = () => {
    setVoting(true);
    setVoteCacheSendStackId(vote.cacheSend(...[topicId, selectedOptionIndex + 1], { from: account }));
  };

  const onUnvote = (e) => {
    e.preventDefault();
    setVoting(true);
    setVoteCacheSendStackId(vote.cacheSend(...[topicId, 0], { from: account }));
  };

  useEffect(() => {
    if (voting && transactionStack && transactionStack[voteCacheSendStackId]
        && transactions[transactionStack[voteCacheSendStackId]]) {
      if (transactions[transactionStack[voteCacheSendStackId]].status === TRANSACTION_ERROR
            || transactions[transactionStack[voteCacheSendStackId]].status === TRANSACTION_SUCCESS) {
        setVoting(false);
      }
    }
  }, [transactionStack, transactions, voteCacheSendStackId, voting]);

  if (hasUserVoted && !enableVoteChanges) {
    return (
        <>
            <div>
                {t('topic.poll.tab.results.user.vote')}
                <span className="poll-voted-option">{pollOptions[userVoteIndex]}</span>
            </div>
            <div>
                {t('topic.poll.tab.vote.no.changes')}
            </div>
        </>
    );
  }

  return (
      <Form onSubmit={onCastVote}>
          <Form.Group grouped>
              <label htmlFor="poll">{t('topic.poll.tab.vote.form.radio.label')}</label>
              {pollOptions.map((pollOption, index) => (
                  <Form.Radio
                    key={pollOption}
                    label={pollOption}
                    value={index}
                    className={index === userVoteIndex ? 'poll-voted-option' : null}
                    checked={index === selectedOptionIndex}
                    disabled={voting}
                    onChange={onOptionSelected}
                  />
              ))}
          </Form.Group>
          <Button
            type="submit"
            className="primary-button"
            disabled={voting || (selectedOptionIndex === userVoteIndex)}
          >
              {t('topic.poll.tab.vote.form.button.submit')}
          </Button>
          {hasUserVoted && enableVoteChanges
            && (
                <Button
                  type="submit"
                  disabled={voting}
                  onClick={onUnvote}
                >
                    {t('topic.poll.tab.vote.form.button.unvote')}
                </Button>
            )}
      </Form>
  );
};

PollVote.defaultProps = {
  userVoteIndex: -1,
};

PollVote.propTypes = {
  topicId: PropTypes.number.isRequired,
  pollOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  enableVoteChanges: PropTypes.bool.isRequired,
  hasUserVoted: PropTypes.bool.isRequired,
  userVoteIndex: PropTypes.number,
};

export default PollVote;
