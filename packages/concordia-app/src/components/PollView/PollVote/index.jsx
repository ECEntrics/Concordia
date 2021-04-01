import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';

const { contracts: { [VOTING_CONTRACT]: { methods: { vote } } } } = drizzle;

const PollVote = (props) => {
  const {
    topicId, account, pollOptions, enableVoteChanges, hasUserVoted, userVoteIndex,
  } = props;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(userVoteIndex);
  const [voting, setVoting] = useState('');
  const { t } = useTranslation();

  const onOptionSelected = (e, { value }) => {
    setSelectedOptionIndex(value);
  };

  const onCastVote = () => {
    setVoting(true);
    vote.cacheSend(...[topicId, selectedOptionIndex + 1], { from: account });
  };

  return (
      <Form onSubmit={onCastVote}>
          <Form.Group grouped>
              <label htmlFor="poll">{t('topic.poll.tab.vote.form.radio.label')}</label>
              {pollOptions.map((pollOption, index) => (
                  <Form.Radio
                    key={pollOption}
                    label={pollOption}
                    value={index}
                    checked={index === selectedOptionIndex}
                    disabled={hasUserVoted && !enableVoteChanges && index !== selectedOptionIndex}
                    onChange={onOptionSelected}
                  />
              ))}
          </Form.Group>
          <Form.Button
            type="submit"
            disabled={voting || (hasUserVoted && !enableVoteChanges) || (selectedOptionIndex === userVoteIndex)}
          >
              {t('topic.poll.tab.vote.form.button.submit')}
          </Form.Button>
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
