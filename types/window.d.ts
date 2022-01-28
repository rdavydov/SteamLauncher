import type {IpcRendererEvent} from 'electron';

declare global {
  interface Window {
    api: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      send: (channel: string, ...args: any[]) => void;
      on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
      storage: {
        get: (key: string, defaultValue = undefined) => Promise<any>;
        set: (key: string, value: unknown) => Promise<any>;
      };
    };
  }
}
