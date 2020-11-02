import React from 'react';
import { withRouter } from 'react-router';
import { Menu } from 'semantic-ui-react';

import AppContext from './AppContext';

import appLogo from '../assets/images/app_logo.png';
import SignUpForm from './SignUpForm';

const MenuComponent = (props) => {
  const { history: { push } } = props;

  return (
      <AppContext.Consumer>
          {() => (
              <div>
                  <Menu color="black" inverted>
                      <Menu.Item
                        link
                        name="home"
                        onClick={() => { push('/'); }}
                      >
                          <img src={appLogo} alt="app_logo" />
                      </Menu.Item>

                      <SignUpForm />

                  </Menu>
              </div>
          )}
      </AppContext.Consumer>
  );
};

export default withRouter(MenuComponent);
