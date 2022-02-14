type StoreGameDataType = {
  appId: string;
  name: string;
  path: string;
  runPath: string;
  commandLine: string;
  header: string;
};

type StoreGamesDataType = Record<string, StoreGameDataType>;
