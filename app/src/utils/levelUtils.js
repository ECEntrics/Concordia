import level from 'level'

const db = level('./orbitdb/identity/identitykeys');

async function getPrivateKey(id){
  try{
    const keyPair = await db.get(id);
    return JSON.parse(keyPair).privateKey;
  } catch (err) {
    if (err && err.notFound)
      console.error("LevelDB: Private Key not found!");
    throw err;
  }
}

async function setKeyPair(id, publicKey, privateKey){
  await db.put(id,JSON.stringify({publicKey: publicKey, privateKey: privateKey}));
}

export { getPrivateKey, setKeyPair }
