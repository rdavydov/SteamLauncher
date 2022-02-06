import {ipcMain} from 'electron';
import storage from '../storage.js';
import showToast from '../functions/show-toast.js';

ipcMain.on('settings-edit', (event, inputs) => {
  storage.set('settings', inputs);
  showToast(event, 'Settings edited successfully!', 'success');
  event.sender.send('close-modal');
});

ipcMain.on('settings-set-network', (event, data) => {
  storage.set('network', data);
  if (data) {
    showToast(event, 'You are online!', 'success');
  } else {
    showToast(event, 'You are offline!', 'warning');
  }
});

ipcMain.handle('settings-get-network', () => {
  return storage.get('network');
});

ipcMain.handle('settings-data', () => {
  return storage.get('settings');
});
