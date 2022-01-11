import {ipcMain} from 'electron';
import {randomInt} from 'node:crypto';
import {fromIndividualAccountID} from 'steamid';
import storage from '../functions/storage.js';
import showToast from '../functions/show-toast.js';

const closeModalEvent = 'account-view-close-modal';
const maxSafeInt = 281_474_976_710_655;

ipcMain.on('account-create', (event, inputs) => {
  storage.set('account', inputs);
  showToast(event, 'Account created successfully!', 'success');
  event.sender.send(closeModalEvent);
});

ipcMain.on('account-edit', (event, inputs) => {
  storage.set('account', inputs);
  showToast(event, 'Account edited successfully!', 'success');
  event.sender.send(closeModalEvent);
});

ipcMain.handle('account-data', (): Record<string, string> | undefined => {
  return storage.get('account');
});

ipcMain.handle('account-exist', () => {
  return storage.has('account');
});

ipcMain.handle('account-get-random-steamid', () => {
  return fromIndividualAccountID(randomInt(maxSafeInt)).getSteamID64();
});
