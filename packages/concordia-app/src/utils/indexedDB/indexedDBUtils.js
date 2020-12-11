import { breeze } from '../../redux/store';

const purgeIndexedDBs = async () => {
  const { ipfs, orbit } = breeze;

  if (orbit) await orbit.stop();
  if (ipfs) await ipfs.stop();

  const databases = await indexedDB.databases();
  return Promise.all(
    databases.map((db) => new Promise(
      (resolve, reject) => {
        const request = indexedDB.deleteDatabase(db.name);
        request.onsuccess = resolve;
        request.onerror = reject;
      },
    )),
  );
};

export default purgeIndexedDBs;
