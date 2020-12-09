import { breeze } from '../../redux/store';

async function purgeIndexedDBs() {
  const { ipfs, orbit } = breeze;
  if (orbit) await orbit.stop();
  if (ipfs) await ipfs.stop();

  const dbs = await indexedDB.databases();
  await Promise.all(
    dbs.map((db) => new Promise(
      (resolve, reject) => {
        const request = indexedDB.deleteDatabase(db.name);
        request.onsuccess = resolve;
        request.onerror = reject;
      },
    )),
  );
}

export default purgeIndexedDBs;
