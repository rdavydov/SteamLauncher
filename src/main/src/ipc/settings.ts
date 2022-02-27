import {ipcMain} from 'electron';
import storage from '../storage.js';
import snack from '../functions/snack.js';
import {hiddenModalChannel} from '../config.js';

ipcMain.on('settings-edit', (event, inputs: StoreSettingsType) => {
  storage.set('settings', inputs);
  snack('Settings edited successfully!', 'success');
  event.sender.send(hiddenModalChannel);
});

ipcMain.on('settings-set-network', (_event, data: boolean) => {
  storage.set('settings.network', data);
});

ipcMain.handle('settings-get-network-status', (): boolean => {
  return storage.get('settings.network');
});

ipcMain.handle('settings-data', () => {
  return storage.get('settings');
});
