import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import AppContext from '../../../components/AppContext';
import appLogo from '../../../assets/images/app_logo.png';

const MainLayoutMenu = (props) => {
  const { user: { hasSignedUp } } = props;
  const history = useHistory();
  const { t } = useTranslation();

  return (
      <AppContext.Consumer>
          {() => (
              <div>
                  <Menu color="black" inverted>
                      <Menu.Item
                        link
                        name="home"
                        key="home"
                        onClick={() => { history.push('/'); }}
                      >
                          <img src={appLogo} alt="app_logo" />
                      </Menu.Item>
                      {hasSignedUp
                        ? (
                            <Menu.Item
                              link
                              name="profile"
                              key="profile"
                              onClick={() => { history.push('/profile'); }}
                              position="right"
                            >
                                {t('topbar.button.profile')}
                            </Menu.Item>
                        )
                        : (
                            <Menu.Item
                              link
                              name="register"
                              key="register"
                              onClick={() => { history.push('/auth/register'); }}
                              position="right"
                            >
                                {t('topbar.button.register')}
                            </Menu.Item>
                        )}
                  </Menu>
              </div>
          )}
      </AppContext.Consumer>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(MainLayoutMenu);
