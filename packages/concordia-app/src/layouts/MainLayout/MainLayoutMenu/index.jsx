import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import AppContext from '../../../components/AppContext';
import appLogo from '../../../assets/images/app_logo.png';
import purgeIndexedDBs from '../../../utils/indexedDB/indexedDBUtils';

const MainLayoutMenu = () => {
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const history = useHistory();
  const { t } = useTranslation();

  return (
      <AppContext.Consumer>
          {() => (
              <Menu color="black" inverted>
                  <Menu.Item
                    link
                    name="home"
                    key="home"
                    onClick={() => { history.push('/'); }}
                  >
                      <img src={appLogo} alt="app_logo" />
                  </Menu.Item>
                  <Menu.Menu position="right">
                      {hasSignedUp && history.location.pathname === '/home' && (
                          <Menu.Item
                            link
                            name="create-topic"
                            key="create-topic"
                            onClick={() => { history.push('/topics/new'); }}
                            position="right"
                          >
                              {t('topbar.button.create.topic')}
                          </Menu.Item>
                      )}
                      {hasSignedUp
                        ? (
                            <Menu.Item
                              link
                              name="profile"
                              key="profile"
                              onClick={() => { history.push('/profile'); }}
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
                            >
                                {t('topbar.button.register')}
                            </Menu.Item>
                        )}
                      <Menu.Item
                        link
                        name="purge"
                        key="purge"
                        onClick={async () => {
                          await purgeIndexedDBs();
                        }}
                      >
                          Purge
                      </Menu.Item>
                  </Menu.Menu>
              </Menu>
          )}
      </AppContext.Consumer>
  );
};

export default MainLayoutMenu;
