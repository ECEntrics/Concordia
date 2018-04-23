import ForumContract from '../../../build/contracts/Forum.json'
import store from '../../../store'

const contract = require('truffle-contract');

export const USER_UPDATED = 'USER_UPDATED';
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user
  }
}

export function updateUser(name) {
  let web3 = store.getState().web3.web3Instance;

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(ForumContract);
      authentication.setProvider(web3.currentProvider);

      // Declaring this for later so we can chain functions on Authentication.
      let authenticationInstance;

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance;

          // Attempt to login user.
          authenticationInstance.signUp(JSON.stringify(name), {from: coinbase})
          .then(function(result) {
            console.log("SignUp/name update successful: " + name);
            // If no error, update user.
            dispatch(userUpdated({"name": name}));

            return alert('Name updated!')
          })
          .catch(function(result) {
            // If error...
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
