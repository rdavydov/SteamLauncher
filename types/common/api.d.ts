import type {IpcRendererEvent} from 'electron';

declare global {
  interface Window {
    api: {
      send: (channel: string, ...args: any[]) => void;
      on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
      window: {
        minimize: () => Promise<any>;
        maximize: () => Promise<any>;
        restore: () => Promise<any>;
        close: () => Promise<any>;
      };
      app: {
        getName: () => Promise<string>;
        getVersion: () => Promise<string>;
        getDescription: () => Promise<string>;
        getCopyright: () => Promise<string>;
        filePathParse: (path: string) => Promise<Record<string, string>>;
        choseDirectory: () => Promise<string[] | undefined>;
        choseFile: () => Promise<string[] | undefined>;
      };
      account: {
        getData: () => Promise<StoreAccountType | undefined>;
        getRandomSteamId: () => Promise<string>;
        exist: () => Promise<boolean>;
      };
      settings: {
        getData: () => Promise<StoreSettingsType | undefined>;
        getNetworkStatus: () => Promise<boolean | undefined>;
        setNetworkStatus: (to: boolean) => any;
      };
      game: {
        getData: (appId: string) => Promise<StoreGameDataType | undefined>;
        openContextMenu: (appId: string) => any;
      };
      games: {
        getData: () => Promise<StoreGamesDataType | undefined>;
      };
    };
  }
}
