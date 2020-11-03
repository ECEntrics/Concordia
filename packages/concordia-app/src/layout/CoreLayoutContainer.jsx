import React from 'react';
import PropTypes from 'prop-types';

import MenuComponent from '../components/MenuComponent';

const CoreLayout = (props) => {
  const { children } = props;

  return (
      <div>
          <MenuComponent />
          {children}
      </div>
  );
};

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default CoreLayout;
