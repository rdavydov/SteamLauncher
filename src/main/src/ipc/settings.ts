import {
  ipcMain as ipc,
} from 'electron';
import {
  hiddenModalChannel,
} from '../config';
import notify from '../functions/notify';
import storage from '../storage';

ipc.on('settings-edit', (event, inputs: StoreSettingsType) => {
  storage.set('settings', inputs);
  notify('Settings edited successfully!');
  event.sender.send(hiddenModalChannel);
});

ipc.on('settings-set-network', (_event, data: boolean) => {
  storage.set('settings.network', data);
});

ipc.handle('settings-get-network-status', (): boolean => {
  return storage.get('settings.network');
});

ipc.handle('settings-data', () => {
  return storage.get('settings');
});
