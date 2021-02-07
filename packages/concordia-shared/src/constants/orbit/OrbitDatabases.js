const USER_DATABASE = 'user';
const TOPICS_DATABASE = 'topics';
const POSTS_DATABASE = 'posts';

const databases = [
  {
    address: USER_DATABASE,
    type: 'keyvalue',
  },
  {
    address: TOPICS_DATABASE,
    type: 'keyvalue',
  },
  {
    address: POSTS_DATABASE,
    type: 'keyvalue',
  },
];

module.exports = Object.freeze({
  USER_DATABASE,
  TOPICS_DATABASE,
  POSTS_DATABASE,
  databases,
});
