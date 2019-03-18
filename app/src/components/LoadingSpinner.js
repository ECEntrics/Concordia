import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ className, style }) => (
  <div className="vertical-center-children">
    <div
      className={`center-in-parent ${
        className ? className : ''}`}
      style={style ? style : []}
    >
      <p>
        <i className="fas fa-spinner fa-3x fa-spin" />
      </p>
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  className: PropTypes.string,
  style: PropTypes.string
};

export default LoadingSpinner;
