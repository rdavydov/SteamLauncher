type StoreGameDataType = {
  appId: string,
  commandLine: string,
  header: string,
  listenPort: string,
  name: string,
  overlay: boolean,
  path: string,
  runPath: string,
};

type StoreGamesDataType = Record<string, StoreGameDataType>;
