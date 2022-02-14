import {ipcMain} from 'electron';
import {fromIndividualAccountID} from 'steamid';
import {customAlphabet} from 'nanoid/non-secure';
import storage from '../storage.js';
import config from '../config.js';
import snack from '../functions/snack.js';

const nanoid = customAlphabet('0123456789', 8);

ipcMain.on('account-create', (event, inputs) => {
  storage.set('account', inputs);
  snack('Account created successfully!', 'success');
  event.sender.send(config.closeModalChannel);
});

ipcMain.on('account-edit', (event, inputs) => {
  storage.set('account', inputs);
  snack('Account edited successfully!', 'success');
  event.sender.send(config.closeModalChannel);
});

ipcMain.handle('account-data', () => {
  return storage.get('account');
});

ipcMain.handle('account-exist', () => {
  return storage.has('account');
});

ipcMain.handle('account-get-random-steamid', () => {
  return fromIndividualAccountID(nanoid()).getSteamID64();
});
