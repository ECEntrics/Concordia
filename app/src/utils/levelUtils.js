import level from 'level'

/* Used in development only to store the identity.signatures.publicKey so developers don't have to
repeatedly sign theOrbitDB creation transaction in MetaMask when React development server reloads
the app */
const apellaDB = level('./apella/identities');

async function storeIdentitySignaturePubKey(key, signaturePubKey){
  await apellaDB.put(key, signaturePubKey);
}

// If it exists, it returns the identity.signatures.publicKey for the given key (key is the
// concatenation of identity.publicKey + identity.signatures.id
async function getIdentitySignaturePubKey(key){
  try{
    return  await apellaDB.get(key);
  } catch (err) {
    if (err && err.notFound)
      return null;  // Not found
    throw err;
  }
}

export { storeIdentitySignaturePubKey ,getIdentitySignaturePubKey };
