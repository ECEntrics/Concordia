import sha256 from 'crypto-js/sha256';

function generateHash(message) {
  return sha256(message).toString().substring(0, 16);
}

export default generateHash;
