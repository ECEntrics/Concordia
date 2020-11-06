import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { PLACEHOLDER_TYPE_POST, PLACEHOLDER_TYPE_TOPIC } from '../../constants/PlaceholderTypes';

const Placeholder = (props) => {
  const { placeholderType, extra } = props;

  switch (placeholderType) {
    case PLACEHOLDER_TYPE_TOPIC:
      return (
          <>
              <List.Header>
                  <List.Icon name="right triangle" />
                  topicSubject
              </List.Header>
              <List.Content>
                  username
                  Number of Replies
                  timestamp
              </List.Content>
          </>
      );
    case PLACEHOLDER_TYPE_POST:
      return (
          <div>LOADING POST</div>
      );
    default:
      return <div />;
  }
};

const TopicPlaceholderExtra = PropTypes.PropTypes.shape({
  topicId: PropTypes.number.isRequired,
});

const PostPlaceholderExtra = PropTypes.PropTypes.shape({
  postIndex: PropTypes.number.isRequired,
});

Placeholder.propTypes = {
  placeholderType: PropTypes.string.isRequired,
  extra: PropTypes.oneOfType([
    TopicPlaceholderExtra.isRequired,
    PostPlaceholderExtra.isRequired,
  ]),
};

export default Placeholder;
