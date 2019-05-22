import { web3 } from '../redux/sagas/drizzleUtilsSaga';
import { getIdentitySignaturePubKey, storeIdentitySignaturePubKey } from './levelUtils';

class EthereumIdentityProvider {
  constructor (options = {}) {  // Orbit's Identity Id (equals user's Ethereum address)
    this.id = options.id; // web3.eth.getAccounts())[0]
  }

  static get type () { return 'ethereum'; }

  async getId () { return this.id; }

  async signIdentity (data) {
    if(process.env.NODE_ENV==='development') {
      console.debug("Attempting to find stored Orbit identity data...");
      const signaturePubKey = await getIdentitySignaturePubKey(data);
      if (signaturePubKey) {
        if (EthereumIdentityProvider.verifyIdentityInfo({
          id: this.id,
          pubKeySignId: data,
          signaturePubKey
        })) {
          console.debug("Found and verified stored Orbit identity data!");
          return signaturePubKey;
        }
        console.debug("Stored Orbit identity data couldn't be verified.");
      }
      else
        console.debug("No stored Orbit identity data were found.");
    }

    while(true){  //Insist (e.g. if user dismisses dialog)
      try{
        const signaturePubKey = await web3.eth.personal.sign(data, this.id,"");
        if(process.env.NODE_ENV==='development')
          storeIdentitySignaturePubKey(data, signaturePubKey)
            .then(()=>{
              console.debug("Successfully stored current Orbit identity data.");
            })
            .catch(()=>{
              console.warn("Couldn't store current Orbit identity data...");
            });
        return signaturePubKey;  //Password not required for MetaMask
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

  static async verifyIdentityInfo (identityInfo) {
    // Verify that identity was signed by the ID
    return web3.eth.accounts.recover(identityInfo.pubKeySignId,
      identityInfo.signaturePubKey) === identityInfo.id;
  }
}

export default EthereumIdentityProvider;
