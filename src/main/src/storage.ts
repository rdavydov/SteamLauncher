import ElectronStore from 'electron-store';

const defaults = {
  settings: {
    network: true,
  },
};
const options = {defaults};

const storage = new ElectronStore<StoreType>(options);

export default storage;
