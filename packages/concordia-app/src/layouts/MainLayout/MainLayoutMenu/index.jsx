import React, { useState } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import AppContext from '../../../components/AppContext';
import ClearDatabasesModal from '../../../components/ClearDatabasesModal';
import appLogo from '../../../assets/images/app_logo.svg';
import './styles.css';

const MainLayoutMenu = () => {
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const [isClearDatabasesOpen, setIsClearDatabasesOpen] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  const handleClearDatabasesClick = () => {
    setIsClearDatabasesOpen(true);
  };

  const handleDatabasesCleared = () => {
    setIsClearDatabasesOpen(false);
    history.push('/home');
    window.location.reload(false);
  };

  const handleCancelDatabasesClear = () => {
    setIsClearDatabasesOpen(false);
  };

  return (
      <AppContext.Consumer>
          {() => (
              <Menu inverted>
                  <Menu.Item
                    id="home-button"
                    link
                    name="home"
                    key="home"
                    onClick={() => history.push('/')}
                  >
                      <img src={appLogo} alt="app_logo" />
                  </Menu.Item>
                  <Menu.Menu position="right">
                      {hasSignedUp && history.location.pathname === '/home' && (
                          <Menu.Item
                            link
                            name="create-topic"
                            key="create-topic"
                            onClick={() => history.push('/topics/new')}
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
                              onClick={() => history.push('/profile')}
                            >
                                {t('topbar.button.profile')}
                            </Menu.Item>
                        )
                        : (
                            <Menu.Item
                              link
                              name="register"
                              key="register"
                              onClick={() => history.push('/auth/register')}
                            >
                                {t('topbar.button.register')}
                            </Menu.Item>
                        )}
                      <Menu.Item
                        link
                        name="about"
                        key="about"
                        onClick={() => history.push('/about')}
                      >
                          {t('topbar.button.about')}
                      </Menu.Item>
                  </Menu.Menu>
                  <Dropdown key="overflow" item direction="left">
                      <Dropdown.Menu>
                          <Dropdown.Item
                            name="clear-databases"
                            key="clear-databases"
                            onClick={handleClearDatabasesClick}
                          >
                              {t('topbar.button.clear.databases')}
                          </Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>

                  <ClearDatabasesModal
                    open={isClearDatabasesOpen}
                    onDatabasesCleared={handleDatabasesCleared}
                    onCancel={handleCancelDatabasesClear}
                  />
              </Menu>
          )}
      </AppContext.Consumer>
  );
};

export default MainLayoutMenu;
