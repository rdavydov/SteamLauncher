import storage from '../storage.js';

const gamesGetData = (): Record<string, Record<string, string>> | undefined => {
  return storage.get('games');
};

export default gamesGetData;
