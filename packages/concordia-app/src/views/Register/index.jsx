import React, { useCallback, useMemo, useState } from 'react';
import {
  Button, Card, Header, Icon, Step,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import './styles.css';
import SignUpStep from './SignUpStep';
import PersonalInformationStep from './PersonalInformationStep';
import { REGISTER_STEP_PROFILE_INFORMATION, REGISTER_STEP_SIGNUP } from '../../constants/RegisterSteps';

const Register = () => {
  const [currentStep, setCurrentStep] = useState('signup');
  const user = useSelector((state) => state.user);
  const [signingUp] = useState(!user.hasSignedUp);
  const history = useHistory();
  const { t } = useTranslation();

  const goToHomePage = useCallback(() => history.push('/'), [history]);

  const pushNextStep = useCallback(() => {
    if (currentStep === REGISTER_STEP_SIGNUP) {
      setCurrentStep(REGISTER_STEP_PROFILE_INFORMATION);
    }

    if (currentStep === REGISTER_STEP_PROFILE_INFORMATION) {
      goToHomePage();
    }
  }, [currentStep, goToHomePage]);

  const activeStep = useMemo(() => {
    if (currentStep === REGISTER_STEP_SIGNUP) {
      return (
          <SignUpStep pushNextStep={pushNextStep} />
      );
    }

    if (currentStep === REGISTER_STEP_PROFILE_INFORMATION) {
      return (
          <PersonalInformationStep pushNextStep={pushNextStep} />
      );
    }

    return null;
  }, [currentStep, pushNextStep]);

  return (
      <div className="register-centered form-card-container">
          <Card fluid>
              <Card.Content>
                  {
                  !user.hasSignedUp && (
                      <Card.Header>
                          <Step.Group>
                              <Step
                                key="register-form-step-signup"
                                active={currentStep === REGISTER_STEP_SIGNUP}
                              >
                                  <Icon name="signup" />
                                  <Step.Content>
                                      <Step.Title>
                                          {t('register.form.sign.up.step.title')}
                                      </Step.Title>
                                      <Step.Description>
                                          {t('register.form.sign.up.step.description')}
                                      </Step.Description>
                                  </Step.Content>
                              </Step>
                              <Step
                                key="register-form-step-profile-information"
                                active={currentStep === REGISTER_STEP_PROFILE_INFORMATION}
                              >
                                  <Icon name="user circle" />
                                  <Step.Content>
                                      <Step.Title>
                                          {t('register.form.profile.information.step.title')}
                                      </Step.Title>
                                      <Step.Description>
                                          {t('register.form.profile.information.step.description')}
                                      </Step.Description>
                                  </Step.Content>
                              </Step>
                          </Step.Group>
                      </Card.Header>
                  )
                }
                  <Card.Description>
                      <p>
                          <strong>{t('register.p.account.address')}</strong>
                            &nbsp;
                          {user.address}
                      </p>
                  </Card.Description>
              </Card.Content>
              {user.hasSignedUp && !signingUp
                ? (
                    <>
                        <Card.Content>
                            <Card.Description>
                                <div>
                                    <Header as="h4" className="i18next-newlines">
                                        {t('register.form.header.already.member.message')}
                                    </Header>
                                </div>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button
                              color="black"
                              floated="right"
                              content={t('register.form.button.back')}
                              onClick={goToHomePage}
                            />
                        </Card.Content>
                    </>
                )
                : activeStep}
          </Card>
      </div>
  );
};

export default Register;
