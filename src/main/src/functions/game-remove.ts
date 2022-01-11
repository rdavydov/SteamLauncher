import gamesGetData from './games-get-data.js';

const gameRemove = (appId: string) => {
  const gamesData = gamesGetData();
  if (typeof gamesData !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete gamesData[appId];

    return gamesData;
  }

  return null;
};

export default gameRemove;
