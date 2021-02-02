import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Button, Card, Form, Image, Input, Message,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import checkUrlValid from '../../../utils/urlUtils';
import { breeze } from '../../../redux/store';
import './styles.css';
import { USER_DATABASE } from '../../../constants/orbit/OrbitDatabases';
import { USER_LOCATION, USER_PROFILE_PICTURE } from '../../../constants/orbit/UserDatabaseKeys';

const { orbit: { stores } } = breeze;

const PersonalInformationStep = (props) => {
  const { pushNextStep } = props;
  const [profilePictureInput, setProfilePictureInput] = useState('');
  const [profilePictureUrlValid, setProfilePictureUrlValid] = useState(true);
  const [locationInput, setLocationInput] = useState('');
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    let formHasError = false;
    const formErrors = [];

    if (!profilePictureUrlValid) {
      formHasError = true;
      formErrors.push(t('register.form.personal.information.step.error.invalid.profile.picture.url.message'));
    }

    setError(formHasError);
    setErrorMessages(formErrors);
  }, [profilePictureUrlValid, t]);

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
    ? (
        <div className="register-form-profile-picture-wrapper">
            <Image rounded src={profilePictureInput} className="register-form-profile-picture" />
        </div>
    )
    : null
  ), [profilePictureInput, profilePictureUrlValid]);

  const handleSubmit = useCallback(() => {
    if (error) {
      return;
    }

    const keyValuesToStore = [];

    if (profilePictureInput.length > 0) {
      keyValuesToStore.push({
        key: USER_PROFILE_PICTURE,
        value: profilePictureInput,
      });
    }

    if (locationInput.length > 0) {
      keyValuesToStore.push({
        key: USER_LOCATION,
        value: locationInput,
      });
    }

    if (keyValuesToStore.length > 0) {
      const userDb = Object.values(stores).find((store) => store.dbname === USER_DATABASE);

      keyValuesToStore
        .reduce((acc, keyValueToStore) => acc
          .then(() => userDb
            .put(keyValueToStore.key, keyValueToStore.value, { pin: true })),
        Promise.resolve())
        .then(() => pushNextStep())
        .catch((reason) => {
          console.log(reason);
        });
    }
  }, [error, locationInput, profilePictureInput, pushNextStep]);

  const goToHomePage = () => history.push('/');

  return (
      <>
          <Card.Content>
              <Card.Description>
                  <Form>
                      <Form.Field>
                          <label htmlFor="form-register-field-profile-picture">
                              {t('register.form.personal.information.step.profile.picture.field.label')}
                          </label>
                          <Input
                            id="form-register-field-profile-picture"
                            placeholder={t('register.form.personal.information.step.profile.picture.field.placeholder')}
                            name="profilePictureInput"
                            className="form-input"
                            value={profilePictureInput}
                            onChange={handleInputChange}
                          />
                      </Form.Field>
                      {profilePicture}
                      <Form.Field>
                          <label htmlFor="form-register-field-location">
                              {t('register.form.personal.information.step.location.field.label')}
                          </label>
                          <Input
                            id="form-register-field-location"
                            placeholder={t('register.form.personal.information.step.location.field.placeholder')}
                            name="locationInput"
                            className="form-input"
                            value={locationInput}
                            onChange={handleInputChange}
                          />
                      </Form.Field>
                  </Form>
              </Card.Description>
          </Card.Content>
          {error === true && (
              <Card.Content extra>
                  {errorMessages
                    .map((errorMessage) => (
                        <Message
                          error
                          header={t('register.form.personal.information.step.error.message.header')}
                          content={errorMessage}
                        />
                    ))}
              </Card.Content>
          )}
          <Card.Content extra>
              <Button
                className="primary-button"
                floated="right"
                content={t('register.form.personal.information.step.button.submit')}
                onClick={handleSubmit}
                disabled={!profilePictureUrlValid}
              />
              <Button
                className="skip-button"
                floated="right"
                content={t('register.form.personal.information.step.button.skip')}
                onClick={goToHomePage}
              />
          </Card.Content>
      </>
  );
};

PersonalInformationStep.propTypes = {
  pushNextStep: PropTypes.func.isRequired,
};

export default PersonalInformationStep;
