import {ipcMain} from 'electron';
import storage from '../storage.js';

ipcMain.handle('storage_get', (_event, key: string, defaultValue = undefined) => {
  return storage.get(key, defaultValue) as unknown;
});

ipcMain.handle('storage_set', (_event, key: string, value: unknown) => {
  storage.set(key, value);
});
