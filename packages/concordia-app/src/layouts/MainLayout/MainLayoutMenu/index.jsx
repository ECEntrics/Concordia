import React from 'react';
import { withRouter } from 'react-router';
import { Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import AppContext from '../../../components/AppContext';
import appLogo from '../../../assets/images/app_logo.png';

const MainLayoutMenu = (props) => {
  const { history: { push } } = props;
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
                        onClick={() => { push('/'); }}
                      >
                          <img src={appLogo} alt="app_logo" />
                      </Menu.Item>
                      <Menu.Item
                        link
                        name="register"
                        key="register"
                        onClick={() => { push('/auth/register'); }}
                        position="right"
                      >
                          {t('topbar.button.signup')}
                      </Menu.Item>
                  </Menu>
              </div>
          )}
      </AppContext.Consumer>
  );
};

export default withRouter(MainLayoutMenu);
