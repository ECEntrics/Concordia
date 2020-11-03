import React from 'react';
import PropTypes from 'prop-types';

const RegisterLayout = (props) => {
  const { children } = props;

  return (
      <div id="register-layout">
          {children}
      </div>
  );
};

RegisterLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default RegisterLayout;
