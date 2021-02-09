import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Button, Form, Icon, Image, Input, Message, Modal,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { USER_DATABASE } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import checkUrlValid from '../../../../utils/urlUtils';
import { USER_LOCATION, USER_PROFILE_PICTURE } from '../../../../constants/orbit/UserDatabaseKeys';
import { breeze, drizzle } from '../../../../redux/store';
import UsernameSelector from '../../../../components/UsernameSelector';

const { orbit: { stores } } = breeze;
const { contracts: { [FORUM_CONTRACT]: { methods: { updateUsername } } } } = drizzle;

const EditInformationModal = (props) => {
  const {
    initialUsername, initialAuthorAvatar, initialUserLocation, open, onSubmit, onCancel,
  } = props;
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [usernameChecked, setUsernameChecked] = useState(true);
  const [profilePictureInput, setProfilePictureInput] = useState('');
  const [profilePictureUrlValid, setProfilePictureUrlValid] = useState(true);
  const [locationInput, setLocationInput] = useState('');
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setLocationInput(initialUserLocation || '');
  }, [initialUserLocation]);

  useEffect(() => {
    setProfilePictureInput(initialAuthorAvatar || '');
    setProfilePictureUrlValid(initialAuthorAvatar ? checkUrlValid(initialAuthorAvatar) : true);
  }, [initialAuthorAvatar]);

  useEffect(() => {
    let formHasError = false;
    const formErrors = [];

    if (!profilePictureUrlValid) {
      formHasError = true;
      formErrors.push(t('edit.information.modal.form.error.invalid.profile.picture.url.message'));
    }

    setError(formHasError);
    setErrorMessages(formErrors);
  }, [profilePictureUrlValid, t]);

  const handleUsernameChange = (modifiedUsername) => {
    setUsernameInput(modifiedUsername);
  };

  const handleUsernameErrorChange = useCallback(({
    usernameChecked: isUsernameChecked,
    error: hasUsernameError,
    errorMessage,
  }) => {
    setUsernameChecked(isUsernameChecked);

    if (hasUsernameError) {
      setUsernameError(true);
      setUsernameErrorMessage(errorMessage);
    } else {
      setUsernameError(false);
    }
  }, []);

  const handleInputChange = useCallback((event, { name, value }) => {
    if (name === 'profilePictureInput') {
      setProfilePictureInput(value);

      if (value.length > 0) {
        setProfilePictureUrlValid(checkUrlValid(value));
      } else {
        setProfilePictureUrlValid(true);
      }
    }

    if (name === 'locationInput') {
      setLocationInput(value);
    }
  }, []);

  const profilePicture = useMemo(() => (profilePictureInput.length > 0 && profilePictureUrlValid
    ? (<Image size="medium" src={profilePictureInput} wrapped />)
    : (<Icon name="user circle" size="massive" inverted color="black" />)
  ), [profilePictureInput, profilePictureUrlValid]);

  const handleSubmit = useCallback(() => {
    const keyValuesToStore = [];

    keyValuesToStore.push({
      key: USER_PROFILE_PICTURE,
      value: profilePictureInput,
    });

    keyValuesToStore.push({
      key: USER_LOCATION,
      value: locationInput,
    });

    const userDb = Object.values(stores).find((store) => store.dbname === USER_DATABASE);

    const promiseArray = keyValuesToStore
      .map((keyValueToStore) => {
        if (keyValueToStore.value !== '') {
          return userDb
            .put(keyValueToStore.key, keyValueToStore.value, { pin: true });
        }

        return userDb.del(keyValueToStore.key);
      });

    Promise
      .all(promiseArray)
      .then(() => {
        // TODO: display a message
      })
      .catch((reason) => {
        console.log(reason);
      });

    if (usernameInput !== initialUsername) {
      updateUsername.cacheSend(usernameInput);
    }

    onSubmit();
  }, [initialUsername, locationInput, onSubmit, profilePictureInput, usernameInput]);

  return useMemo(() => (
      <Modal
        onClose={onCancel}
        open={open}
      >
          <Modal.Header>{t('edit.information.modal.title')}</Modal.Header>
          <Modal.Content image>
              {profilePicture}
              <Modal.Description>
                  <Form>
                      <UsernameSelector
                        initialUsername={initialUsername}
                        username={usernameInput}
                        onChangeCallback={handleUsernameChange}
                        onErrorChangeCallback={handleUsernameErrorChange}
                      />
                      <Form.Field>
                          <label htmlFor="form-edit-information-field-profile-picture">
                              {t('edit.information.modal.form.profile.picture.field.label')}
                          </label>
                          <Input
                            id="form-edit-information-field-profile-picture"
                            placeholder={t('edit.information.modal.form.profile.picture.field.placeholder')}
                            name="profilePictureInput"
                            className="form-input"
                            value={profilePictureInput}
                            onChange={handleInputChange}
                          />
                      </Form.Field>
                      <Form.Field>
                          <label htmlFor="form-edit-information-field-location">
                              {t('edit.information.modal.form.location.field.label')}
                          </label>
                          <Input
                            id="form-edit-information-field-location"
                            placeholder={t('edit.information.modal.form.location.field.placeholder')}
                            name="locationInput"
                            className="form-input"
                            value={locationInput}
                            onChange={handleInputChange}
                          />
                      </Form.Field>
                  </Form>
                  {error === true && (
                    errorMessages
                      .map((errorMessage) => (
                          <Message
                            error
                            header={t('edit.information.modal.form.error.message.header')}
                            content={errorMessage}
                          />
                      ))
                  )}
                  {usernameError === true && (
                      <Message
                        error
                        header={t('edit.information.modal.form.error.message.header')}
                        content={usernameErrorMessage}
                      />
                  )}
              </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
              <Button className="secondary-button" onClick={onCancel}>
                  {t('edit.information.modal.form.cancel.button')}
              </Button>
              <Button
                className="primary-button"
                content={t('edit.information.modal.form.submit.button')}
                labelPosition="right"
                icon="checkmark"
                onClick={handleSubmit}
                positive
                loading={!usernameChecked}
                disabled={!usernameChecked || error || usernameError}
              />
          </Modal.Actions>
      </Modal>
  ), [
    error, errorMessages, handleInputChange, handleSubmit, handleUsernameErrorChange, initialUsername, locationInput,
    onCancel, open, profilePicture, profilePictureInput, t, usernameChecked, usernameError, usernameErrorMessage,
    usernameInput,
  ]);
};

EditInformationModal.defaultProps = {
  open: false,
};

EditInformationModal.propTypes = {
  profileAddress: PropTypes.string.isRequired,
  initialUsername: PropTypes.string.isRequired,
  initialAuthorAvatar: PropTypes.string,
  initialUserLocation: PropTypes.string,
  open: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditInformationModal;
