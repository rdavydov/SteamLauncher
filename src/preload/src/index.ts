import type {
  IpcRendererEvent,
} from 'electron';
import {
  contextBridge,
  ipcRenderer as ipc,
} from 'electron';

contextBridge.exposeInMainWorld('api', {
  account: {
    async exist () {
      return await ipc.invoke('account-exist');
    },
    async getData () {
      return await ipc.invoke('account-data');
    },
    async getRandomSteamId () {
      return await ipc.invoke('account-get-random-steamid');
    },
  },
  app: {
    async choseDirectory () {
      return await ipc.invoke('app-chose-directory');
    },
    async choseFile () {
      return await ipc.invoke('app-chose-file');
    },
    async filePathParse (path: string) {
      return await ipc.invoke('app-file-path-parse', path);
    },
    async getCopyright () {
      return await ipc.invoke('app-get-copyright');
    },
    async getDescription () {
      return await ipc.invoke('app-get-description');
    },
    async getName () {
      return await ipc.invoke('app-get-name');
    },
    async getVersion () {
      return await ipc.invoke('app-get-version');
    },
    notify (message: string) {
      ipc.invoke('app-notify', message).catch(() => {
        //
      });
    },
  },
  game: {
    async getData (appId: string) {
      return await ipc.invoke('game-data', appId);
    },
    openContextMenu (appId: string) {
      ipc.send('open-contextmenu-game', appId);
    },
  },
  games: {
    async getData () {
      return await ipc.invoke('games-data');
    },
  },
  on (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
    ipc.on(channel, listener);
  },
  send (channel: string, ...args: any[]) {
    ipc.send(channel, ...args);
  },
  settings: {
    async getData () {
      return await ipc.invoke('settings-data');
    },
    async getNetworkStatus () {
      return await ipc.invoke('settings-get-network-status');
    },
    setNetworkStatus (to: boolean) {
      ipc.send('settings-set-network', to);
    },
  },
  window: {
    async close () {
      return await ipc.invoke('window-close');
    },
    async maximize () {
      return await ipc.invoke('window-maximize');
    },
    async minimize () {
      return await ipc.invoke('window-minimize');
    },
    async restore () {
      return await ipc.invoke('window-restore');
    },
  },
});
