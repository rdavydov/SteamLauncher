import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

contextBridge.exposeInMainWorld('api', {
  invoke: async (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
    return ipcRenderer.on(channel, listener);
  },
  storage: {
    get: async (key: string, defaultValue = undefined) => {
      return ipcRenderer.invoke('storage_get', key, defaultValue);
    },
    set: async (key: string, value: unknown) => {
      return ipcRenderer.invoke('storage_set', key, value);
    },
  },
});
