import { web3 } from '../redux/sagas/drizzleUtilsSaga';

class EthereumIdentityProvider {
  constructor (options = {}) {  // Orbit's Identity Id (equals user's Ethereum address)
    this.id = options.id; // web3.eth.getAccounts())[0]
  }

  static get type () { return 'ethereum'; }

  async getId () { return this.id; }

  async signIdentity (data) {
    while(true){  //Insist (e.g. if user dismisses dialog)
      try{
        return await web3.eth.personal.sign(data, this.id,"");  //Password not required for MetaMask
      }
      catch (e) {
        console.error("Failed to sign data.");
      }
    }
  }

  static async verifyIdentity (identity) {
    // Verify that identity was signed by the ID
    return web3.eth.accounts.recover(identity.publicKey + identity.signatures.id,
      identity.signatures.publicKey) === identity.id;
  }
}

export default EthereumIdentityProvider;
