import ElectronStore from 'electron-store';
import {appId as packageAppId} from '../../../../electron-builder.json';
import config from '../config.js';

const environments = import.meta.env;
const defaults = {
  network: true,
  settings: {
    overlay: true,
    listenPort: '47584',
  },
};
const options = {defaults, cwd: config.paths.data};

// NOTE: change this without migration break config
if (environments.PROD) {
  const encryptionKey = packageAppId;
  const fileExtension = 'encrypted';
  Object.assign(options, {encryptionKey, fileExtension});
}

const storage = new ElectronStore(options);

export default storage;
