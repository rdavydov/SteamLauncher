import ElectronStore from 'electron-store';

const defaults = {
  network: true,
  settings: {
    overlay: true,
    listenPort: '47584',
  },
};
const options = {defaults};
const storage = new ElectronStore(options);

export default storage;
