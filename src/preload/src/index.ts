import {contextBridge, ipcRenderer as ipc, IpcRendererEvent} from 'electron';

contextBridge.exposeInMainWorld('api', {
  send(channel: string, ...args: any[]) {
    ipc.send(channel, ...args);
  },
  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
    ipc.on(channel, listener);
  },
  window: {
    async minimize() {
      return ipc.invoke('window-minimize');
    },
    async maximize() {
      return ipc.invoke('window-maximize');
    },
    async restore() {
      return ipc.invoke('window-restore');
    },
    async close() {
      return ipc.invoke('window-close');
    },
  },
  app: {
    async getName() {
      return ipc.invoke('app-get-name');
    },
    async getVersion() {
      return ipc.invoke('app-get-version');
    },
    async getDescription() {
      return ipc.invoke('app-get-description');
    },
    async getCopyright() {
      return ipc.invoke('app-get-copyright');
    },
    async filePathParse(path: string) {
      return ipc.invoke('app-file-path-parse', path);
    },
    async choseDirectory() {
      return ipc.invoke('app-chose-directory');
    },
    async choseFile() {
      return ipc.invoke('app-chose-file');
    },
  },
  account: {
    async getData() {
      return ipc.invoke('account-data');
    },
    async getRandomSteamId() {
      return ipc.invoke('account-get-random-steamid');
    },
    async exist() {
      return ipc.invoke('account-exist');
    },
  },
  settings: {
    async getData() {
      return ipc.invoke('settings-data');
    },
    async getNetworkStatus() {
      return ipc.invoke('settings-get-network-status');
    },
    setNetworkStatus(to: boolean) {
      ipc.send('settings-set-network', to);
    },
  },
  game: {
    async getData(appId: string) {
      return ipc.invoke('game-data', appId);
    },
    openContextMenu(appId: string) {
      ipc.send('open-contextmenu-game', appId);
    },
  },
  games: {
    async getData() {
      return ipc.invoke('games-data');
    },
  },
});
