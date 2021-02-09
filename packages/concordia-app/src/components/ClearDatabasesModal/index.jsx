import React, {
  useCallback, useMemo, useState,
  useEffect,
} from 'react';
import {
  Button, Form, Input, Modal,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import purgeIndexedDBs from '../../utils/indexedDB/indexedDBUtils';

const ClearDatabasesModal = (props) => {
  const {
    open, onDatabasesCleared, onCancel,
  } = props;
  const [confirmationInput, setConfirmationInput] = useState('');
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const user = useSelector((state) => state.user);
  const { t } = useTranslation();

  useEffect(() => {
    if (user.hasSignedUp && confirmationInput === user.username) {
      setUserConfirmed(true);
    } else if (!user.hasSignedUp && confirmationInput === 'concordia') {
      setUserConfirmed(true);
    } else {
      setUserConfirmed(false);
    }
  }, [confirmationInput, user.hasSignedUp, user.username]);

  const handleSubmit = useCallback(() => {
    setIsClearing(true);

    purgeIndexedDBs()
      .then(() => {
        onDatabasesCleared();
      }).catch((reason) => console.log(reason));
  }, [onDatabasesCleared]);

  const onCancelTry = useCallback(() => {
    if (!isClearing) {
      setConfirmationInput('');
      onCancel();
    }
  }, [isClearing, onCancel]);

  const handleInputChange = (event, { value }) => { setConfirmationInput(value); };

  const modalContent = useMemo(() => {
    if (isClearing) {
      return (
          <>
              <p>
                  {t('clear.databases.modal.clearing.progress.message')}
              </p>
          </>
      );
    }

    if (user.hasSignedUp) {
      return (
          <>
              <p>
                  {t('clear.databases.modal.description.pre')}
              </p>
              <p>
                  {t('clear.databases.modal.description.body.user')}
              </p>
              <Form>
                  <Form.Field>
                      <label htmlFor="form-clear-databases-field-confirm">
                          {t('clear.databases.modal.form.username.label.user')}
                      </label>
                      <Input
                        id="form-clear-databases-field-confirm"
                        name="confirmationInput"
                        value={confirmationInput}
                        onChange={handleInputChange}
                      />
                  </Form.Field>
              </Form>
          </>
      );
    }

    return (
        <>
            <p>
                {t('clear.databases.modal.description.pre')}
            </p>
            <Form>
                <Form.Field>
                    <label htmlFor="form-clear-databases-field-confirm">
                        {t('clear.databases.modal.form.username.label.guest')}
                    </label>
                    <Input
                      id="form-clear-databases-field-confirm"
                      name="confirmationInput"
                      value={confirmationInput}
                      onChange={handleInputChange}
                    />
                </Form.Field>
            </Form>
        </>
    );
  }, [confirmationInput, isClearing, t, user.hasSignedUp]);

  return useMemo(() => (
      <Modal
        onClose={onCancelTry}
        open={open}
        size="small"
      >
          <Modal.Header>
              {isClearing
                ? t('clear.databases.modal.clearing.progress.title')
                : t('clear.databases.modal.title')}
          </Modal.Header>
          <Modal.Content>
              <Modal.Description>
                  {modalContent}
              </Modal.Description>
          </Modal.Content>

          {!isClearing && (
              <Modal.Actions>
                  <Button className="secondary-button" onClick={onCancelTry} disabled={isClearing}>
                      {t('clear.databases.modal.cancel.button')}
                  </Button>
                  <Button onClick={handleSubmit} className="primary-button" disabled={!userConfirmed}>
                      {t('clear.databases.modal.clear.button')}
                  </Button>
              </Modal.Actions>
          )}
      </Modal>
  ), [handleSubmit, isClearing, modalContent, onCancelTry, open, t, userConfirmed]);
};

ClearDatabasesModal.defaultProps = {
  open: false,
};

ClearDatabasesModal.propTypes = {
  open: PropTypes.bool,
  onDatabasesCleared: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ClearDatabasesModal;
