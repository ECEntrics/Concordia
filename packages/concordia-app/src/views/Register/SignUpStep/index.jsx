import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Card, Form, Message,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';
import UsernameSelector from '../../../components/UsernameSelector';

const { contracts: { [FORUM_CONTRACT]: { methods: { signUp } } } } = drizzle;

const SignUpStep = (props) => {
  const { pushNextStep, account } = props;
  const user = useSelector((state) => state.user);
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameIsChecked, setUsernameIsChecked] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [registerCacheSendStackId, setRegisterCacheSendStackId] = useState('');

  const history = useHistory();
  const { t } = useTranslation();

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

  const handleUsernameChange = useCallback((modifiedUsername) => {
    setUsernameInput(modifiedUsername);
  }, []);

  const handleUsernameErrorChange = useCallback(({
    usernameChecked: isUsernameChecked,
    error: hasUsernameError,
    errorMessage: usernameErrorMessage,
  }) => {
    setUsernameIsChecked(isUsernameChecked);

    if (hasUsernameError) {
      setError(true);
      setErrorMessage(usernameErrorMessage);
    } else {
      setError(false);
    }
  }, []);

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
                      <UsernameSelector
                        username={usernameInput}
                        onChangeCallback={handleUsernameChange}
                        onErrorChangeCallback={handleUsernameErrorChange}
                      />
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
                className="primary-button"
                floated="right"
                content={t('register.form.sign.up.step.button.submit')}
                onClick={handleSubmit}
                disabled={error || signingUp || usernameInput.length === 0}
                loading={!usernameIsChecked}
              />
              <Button
                className="skip-button"
                floated="right"
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
