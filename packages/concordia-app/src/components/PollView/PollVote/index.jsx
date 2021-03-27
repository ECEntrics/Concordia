import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const PollVote = (props) => {
  const {
    pollOptions, enableVoteChanges, hasUserVoted, userVoteHash,
  } = props;
  const [selectedOptionHash, setSelectedOptionHash] = useState(userVoteHash);
  const { t } = useTranslation();

  const onOptionSelected = (e, { value }) => {
    setSelectedOptionHash(value);
  };

  const onCastVote = () => {
    console.log('vote');
    // TODO
    // TODO: callback for immediate poll data refresh on vote?
  };

  return (
      <Form onSubmit={onCastVote}>
          <Form.Group grouped>
              <label htmlFor="poll">{t('topic.poll.tab.vote.form.radio.label')}</label>
              {pollOptions.map((pollOption) => (
                  <Form.Radio
                    key={pollOption.hash}
                    label={pollOption.label}
                    value={pollOption.hash}
                    checked={pollOption.hash === selectedOptionHash}
                    disabled={hasUserVoted && !enableVoteChanges && pollOption.hash !== selectedOptionHash}
                    onChange={onOptionSelected}
                  />
              ))}
          </Form.Group>
          <Form.Button
            type="submit"
            disabled={(hasUserVoted && !enableVoteChanges) || (selectedOptionHash === userVoteHash)}
          >
              {t('topic.poll.tab.vote.form.button.submit')}
          </Form.Button>
      </Form>
  );
};

PollVote.defaultProps = {
  userVoteHash: '',
};

PollVote.propTypes = {
  pollOptions: PropTypes.arrayOf(PropTypes.exact({
    label: PropTypes.string,
    hash: PropTypes.string,
  })).isRequired,
  enableVoteChanges: PropTypes.bool.isRequired,
  hasUserVoted: PropTypes.bool.isRequired,
  userVoteHash: PropTypes.string,
};

export default PollVote;
