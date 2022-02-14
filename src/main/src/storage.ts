import ElectronStore from 'electron-store';

const defaults = {
  settings: {
    network: true,
    /* Overlay: true,
    listenPort: '47584', */
  },
};
const options = {defaults};

const storage = new ElectronStore<StoreType>(options);

export default storage;
