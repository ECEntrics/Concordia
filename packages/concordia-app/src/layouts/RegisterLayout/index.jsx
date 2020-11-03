import React from 'react';
import PropTypes from 'prop-types';
import Particles from 'react-particles-js';
import particlesOptions from '../../assets/particles';
import '../../assets/css/register-layout.css';

const RegisterLayout = (props) => {
  const { children } = props;

  return (
      <div id="register-layout">
          <Particles className="particles" params={particlesOptions} />
          {children}
      </div>
  );
};

RegisterLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default RegisterLayout;
