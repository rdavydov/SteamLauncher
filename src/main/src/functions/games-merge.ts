import gamesGetData from './games-get-data.js';

const normalizeInputs = (inputs: Record<string, string>) => {
  const data: Record<string, Record<string, string>> = {};
  data[inputs.appId] = inputs;
  delete data[inputs.appId].appId;
  return data;
};

const gamesMerge = (inputs: Record<string, string>) => {
  const data = gamesGetData() ?? {};
  return Object.assign({}, data, normalizeInputs(inputs));
};

export default gamesMerge;
