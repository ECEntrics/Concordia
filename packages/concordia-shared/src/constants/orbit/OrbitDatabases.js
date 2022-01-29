const USER_DATABASE = 'user';
const TOPICS_DATABASE = 'topics';
const POSTS_DATABASE = 'posts';
const POLLS_DATABASE = 'polls';

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
  {
    address: POLLS_DATABASE,
    type: 'keyvalue',
  },
];

const databaseNames = [USER_DATABASE, TOPICS_DATABASE, POSTS_DATABASE, POLLS_DATABASE];

module.exports = Object.freeze({
  USER_DATABASE,
  TOPICS_DATABASE,
  POSTS_DATABASE,
  POLLS_DATABASE,
  databases,
  databaseNames,
});
