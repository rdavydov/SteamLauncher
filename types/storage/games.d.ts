type StoreGameDataType = {
  appId: string;
  name: string;
  path: string;
  runPath: string;
  commandLine: string;
  header: string;
  listenPort: string;
  overlay: boolean;
};

type StoreGamesDataType = Record<string, StoreGameDataType>;
