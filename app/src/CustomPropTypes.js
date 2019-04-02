import PropTypes from 'prop-types';

//TODO: Move this file
const GetTopicResult = PropTypes.PropTypes.shape({
  userAddress: PropTypes.string.isRequired,
  fullOrbitAddress: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  numberOfReplies: PropTypes.number.isRequired
});

const GetPostResult = PropTypes.PropTypes.shape({
  userAddress: PropTypes.string.isRequired,
  fullOrbitAddress: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  topicID: PropTypes.string.isRequired
});

const TopicPlaceholderExtra = PropTypes.PropTypes.shape({
  topicID: PropTypes.number.isRequired,
});

const PostPlaceholderExtra = PropTypes.PropTypes.shape({
  postIndex: PropTypes.number.isRequired,
});

export { GetTopicResult, GetPostResult, TopicPlaceholderExtra, PostPlaceholderExtra };
