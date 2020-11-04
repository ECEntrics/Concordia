import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  Button, Card, Form, Header, Input, Message,
} from 'semantic-ui-react';
import throttle from 'lodash/throttle';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import AppContext from '../../components/AppContext';
import './styles.css';

const Register = (props) => {
  const { user, account, isUserNameTakenResults } = props;
  const {
    drizzle: {
      contracts: {
        Forum: {
          methods: { isUserNameTaken, signUp },
        },
      },
    },
  } = useContext(AppContext.Context);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameIsChecked, setUsernameIsChecked] = useState(true);
  const [usernameIsTaken, setUsernameIsTaken] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signingUp, setSigningUp] = useState(false);
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
        setErrorMessage(t('register.form.error.username.taken.message', { username: usernameInput }));
      } else {
        setUsernameIsTaken(false);
        setError(false);
      }
    }
  }, [isUserNameTakenResults, t, usernameInput]);

  const checkUsernameTaken = useMemo(() => throttle(
    (username) => {
      isUserNameTaken.cacheCall(username);
    }, 200,
  ), [isUserNameTaken]);

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
      signUp.cacheSend(
        ...[usernameInput], { from: account },
      );
    }
  }, [account, signUp, user.hasSignedUp, usernameInput]);

  const goToHomePage = React.useCallback(() => history.push('/'), [history]);

  return (
      <div className="centered form-card-container">
          <Card fluid>
              <Card.Content>
                  <Card.Header>Sign Up</Card.Header>
                  <Card.Description>
                      <p>
                          <strong>{t('register.p.account.address')}</strong>
                            &nbsp;
                          {user.address}
                      </p>
                      {user.hasSignedUp
                        ? (
                            <div>
                                <Header as="h4" className="i18next-newlines">
                                    {t('register.form.header.already.member.message')}
                                </Header>
                            </div>
                        )
                        : (
                            <Form loading={signingUp}>
                                <Form.Field required>
                                    <label htmlFor="form-register-field-username">
                                        {t('register.form.username.field.label')}
                                    </label>
                                    <Input
                                      id="form-register-field-username"
                                      placeholder={t('register.form.username.field.placeholder')}
                                      name="usernameInput"
                                      className="form-input"
                                      value={usernameInput}
                                      onChange={handleInputChange}
                                    />
                                </Form.Field>
                            </Form>
                        )}
                  </Card.Description>
              </Card.Content>
              {error === true && (
                  <Card.Content extra>
                      <Message
                        error
                        header={t('register.form.error.message.header')}
                        content={errorMessage}
                      />
                  </Card.Content>
              )}
              <Card.Content extra>
                  {user.hasSignedUp
                    ? (
                        <Button
                          color="black"
                          floated="right"
                          content={t('register.form.button.back')}
                          onClick={goToHomePage}
                        />
                    )
                    : (
                        <>
                            <Button
                              color="green"
                              floated="right"
                              content={t('register.form.button.submit')}
                              onClick={handleSubmit}
                              disabled={usernameIsTaken || signingUp}
                              loading={!usernameIsChecked}
                            />
                            <Button
                              color="violet"
                              floated="right"
                              basic
                              content={t('register.form.button.guest')}
                              onClick={goToHomePage}
                            />
                        </>
                    )}
              </Card.Content>
          </Card>
      </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  isUserNameTakenResults: state.contracts.Forum.isUserNameTaken,
});

export default connect(mapStateToProps)(Register);
