import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const FloatingButton = ({ onClick }) => (
  <div className="action-button" role="button" onClick={onClick} onKeyUp={onClick} tabIndex={0}>
    <Button icon color="teal" size="large">
      <Icon name="add" />
    </Button>
  </div>
);

FloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default FloatingButton;
