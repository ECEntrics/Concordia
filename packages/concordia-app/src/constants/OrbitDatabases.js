export const USER_DATABASE = 'user';
export const TOPICS_DATABASE = 'topics';
export const POSTS_DATABASE = 'posts';

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

export default databases;
