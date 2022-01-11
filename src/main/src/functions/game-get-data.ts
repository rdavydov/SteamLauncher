import gamesGetData from './games-get-data.js';

const gameGetData = (appId: string): Record<string, unknown> | undefined => {
  const data = gamesGetData();
  return data![appId];
};

export default gameGetData;
