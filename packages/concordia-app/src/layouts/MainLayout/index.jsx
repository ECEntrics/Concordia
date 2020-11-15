import React from 'react';
import PropTypes from 'prop-types';
import MainLayoutMenu from './MainLayoutMenu';

const MainLayout = (props) => {
  const { children } = props;

  return (
      <div id="main-layout">
          <MainLayoutMenu />
          {children}
      </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
