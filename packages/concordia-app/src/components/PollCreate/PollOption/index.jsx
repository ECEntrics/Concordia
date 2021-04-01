import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Icon, Input,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import './styles.css';

const PollOption = (props) => {
  const {
    id, removable, onChange, onRemove,
  } = props;
  const { t } = useTranslation();

  return (
      <Form.Field className="form-poll-option" required>
          <label className="form-topic-create-header" htmlFor="form-poll-create-field-subject">
              {t('poll.create.option.field.label', { id })}
          </label>
          <Input
            id="form-poll-create-field-subject"
            placeholder={t('poll.create.option.field.placeholder', { id })}
            name="pollQuestionInput"
            className="form-input"
            onChange={(e) => onChange(e, id)}
          />
          {removable
              && (
                  <Button
                    className="remove-option-button"
                    key={`form-remove-option-button-${id}`}
                    negative
                    icon
                    onClick={(e) => onRemove(e, id)}
                  >
                      <Icon name="x" />
                  </Button>
              )}
      </Form.Field>
  );
};

PollOption.propTypes = {
  id: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  removable: PropTypes.bool,
};

export default memo(PollOption);
