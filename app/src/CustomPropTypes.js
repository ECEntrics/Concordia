import PropTypes from 'prop-types';

const GetTopicResult = PropTypes.PropTypes.shape({
  0: PropTypes.string,
  1: PropTypes.string,
  2: PropTypes.string,
  3: PropTypes.string,
  4: PropTypes.arrayOf(PropTypes.number)
});

export { GetTopicResult };
