import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Button, Card, Form, Input, Message,
} from 'semantic-ui-react';
import throttle from 'lodash/throttle';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { drizzle } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';

const { contracts: { Forum: { methods: { isUserNameTaken, signUp } } } } = drizzle;

const SignUpStep = (props) => {
  const { pushNextStep, account } = props;
  const user = useSelector((state) => state.user);
  const isUserNameTakenResults = useSelector((state) => state.contracts.Forum.isUserNameTaken);
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameIsChecked, setUsernameIsChecked] = useState(true);
  const [usernameIsTaken, setUsernameIsTaken] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [registerCacheSendStackId, setRegisterCacheSendStackId] = useState('');

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (usernameInput.length > 0) {
      const checkedUsernames = Object
        .values(isUserNameTakenResults)
        .map((callCompleted) => ({
          checkedUsername: callCompleted.args[0],
          isTaken: callCompleted.value,
        }));

      const checkedUsername = checkedUsernames
        .find((callCompleted) => callCompleted.checkedUsername === usernameInput);

      setUsernameIsChecked(checkedUsername !== undefined);

      if (checkedUsername && checkedUsername.isTaken) {
        setUsernameIsTaken(true);
        setError(true);
        setErrorMessage(t('register.form.sign.up.step.error.username.taken.message', { username: usernameInput }));
      } else {
        setUsernameIsTaken(false);
        setError(false);
      }
    }
  }, [isUserNameTakenResults, t, usernameInput]);

  useEffect(() => {
    if (signingUp && transactionStack && transactionStack[registerCacheSendStackId]
            && transactions[transactionStack[registerCacheSendStackId]]) {
      if (transactions[transactionStack[registerCacheSendStackId]].status === TRANSACTION_ERROR) {
        setSigningUp(false);
      } else if (transactions[transactionStack[registerCacheSendStackId]].status === TRANSACTION_SUCCESS) {
        pushNextStep();
        // TODO: display a welcome message?
      }
    }
  }, [pushNextStep, registerCacheSendStackId, signingUp, transactionStack, transactions]);

  const checkUsernameTaken = useMemo(() => throttle(
    (username) => {
      isUserNameTaken.cacheCall(username);
    }, 200,
  ), []);

  const handleInputChange = useCallback((event, { value }) => {
    setUsernameInput(value);

    if (value.length > 0) {
      checkUsernameTaken(value);
    }
  }, [checkUsernameTaken]);

  const handleSubmit = useCallback(() => {
    if (user.hasSignedUp) {
      signUp.cacheSend(usernameInput);
    } else {
      setSigningUp(true);
      setRegisterCacheSendStackId(signUp.cacheSend(...[usernameInput], { from: account }));
    }
  }, [account, user.hasSignedUp, usernameInput]);

  const goToHomePage = () => history.push('/');

  return (
      <>
          <Card.Content>
              <Card.Description>
                  <Form loading={signingUp}>
                      <Form.Field required>
                          <label htmlFor="form-register-field-username">
                              {t('register.form.sign.up.step.username.field.label')}
                          </label>
                          <Input
                            id="form-register-field-username"
                            placeholder={t('register.form.sign.up.step.username.field.placeholder')}
                            name="usernameInput"
                            className="form-input"
                            value={usernameInput}
                            onChange={handleInputChange}
                          />
                      </Form.Field>
                  </Form>
              </Card.Description>
          </Card.Content>
          {error === true && (
              <Card.Content extra>
                  <Message
                    error
                    header={t('register.form.sign.up.step.error.message.header')}
                    content={errorMessage}
                  />
              </Card.Content>
          )}
          <Card.Content extra>
              <Button
                color="green"
                floated="right"
                content={t('register.form.sign.up.step.button.submit')}
                onClick={handleSubmit}
                disabled={usernameIsTaken || signingUp}
                loading={!usernameIsChecked}
              />
              <Button
                color="violet"
                floated="right"
                basic
                content={t('register.form.sign.up.step.button.guest')}
                onClick={goToHomePage}
                disabled={signingUp}
              />
          </Card.Content>
      </>
  );
};

SignUpStep.propTypes = {
  pushNextStep: PropTypes.func.isRequired,
};

export default SignUpStep;
