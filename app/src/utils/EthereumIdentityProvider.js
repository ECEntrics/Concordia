import { web3 } from '../redux/sagas/web3UtilsSaga';

class EthereumIdentityProvider {
  constructor () {
    this.web3 = web3;
  }

  // Returns the type of the identity provider
  static get type () { return 'ethereum' }

  // Returns the signer's id
  async getId () {
    return (await this.web3.eth.getAccounts())[0];
  }

  // Returns a signature of pubkeysignature
  async signIdentity (data) {
    const address = await this.getId();
    return await this.web3.eth.personal.sign(data,address,"");  //Password not required for MetaMask
  }

  static async verifyIdentity (identity) {
    // Verify that identity was signed by the ID
    return web3.eth.accounts.recover(identity.publicKey + identity.signatures.id,
      identity.signatures.publicKey) === identity.id;
  }
}

export default EthereumIdentityProvider;
