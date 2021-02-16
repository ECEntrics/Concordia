import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import MainLayoutMenu from './MainLayoutMenu';
import MainLayoutEthereumStatus from './MainLayoutEthereumStatus';
import MainLayoutIPFSStatus from './MainLayoutIPFSStatus';
import './styles.css';

const MainLayout = (props) => {
  const { children } = props;

  return (
      <div id="main-layout">
          <MainLayoutMenu />
          <Grid id="main-layout-grid">
              <Grid.Column width={4} />
              <Grid.Column width={8}>
                  {children}
              </Grid.Column>
              <Grid.Column width={4}>
                  <MainLayoutEthereumStatus />
                  <MainLayoutIPFSStatus />
              </Grid.Column>
          </Grid>

      </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
