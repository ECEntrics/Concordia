import { breeze } from '../../redux/store';

const purgeIndexedDBs = async () => {
  const { ipfs, orbit } = breeze;

  if (orbit) await orbit.stop();
  if (ipfs) await ipfs.stop();
  const databases = await indexedDB.databases();

  return Promise
    .all(databases
      .filter((database) => database.name !== 'level-js-ethprovider/identities')
      .map((database) => new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(database.name);
        request.onblocked = () => {
          Promise.all([
            orbit && orbit.stop ? orbit.stop() : Promise.resolve(),
            ipfs && ipfs.stop ? ipfs.stop() : Promise.resolve(),
          ]).catch((reason) => {
            console.log(reason);
          });
        };
        request.onsuccess = resolve;
        request.onerror = reject;
      })));
};

export default purgeIndexedDBs;
