import sha256 from 'crypto-js/sha256';

const generateHash = (message) => sha256(message).toString().substring(0, 16);

const generatePollHash = (pollQuestion, pollOptions) => generateHash(JSON
  .stringify({ question: pollQuestion, optionValues: pollOptions }));

export default generatePollHash;
