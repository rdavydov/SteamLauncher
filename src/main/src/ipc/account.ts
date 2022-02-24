import {ipcMain, IpcMainEvent} from 'electron';
import {fromIndividualAccountID} from 'steamid';
import {customAlphabet} from 'nanoid/non-secure';
import storage from '../storage.js';
import {closeModalChannel} from '../config.js';
import snack from '../functions/snack.js';

const nanoid = customAlphabet('0123456789', 8);
const fnAccountCreateEdit = async (event: IpcMainEvent, inputs: StoreAccountType) => {
  if (!fromIndividualAccountID(inputs.steamId).isValidIndividual()) {
    snack('Invalid ' + inputs.steamId + ' SteamId!', 'error');
    return;
  }

  const has = storage.has('account');
  storage.set('account', inputs);
  snack(has ? 'Account edited successfully!' : 'Account created successfully!', 'success');
  event.sender.send(closeModalChannel);
};

ipcMain.on('account-create', fnAccountCreateEdit);
ipcMain.on('account-edit', fnAccountCreateEdit);

ipcMain.handle('account-data', () => {
  return storage.get('account');
});

ipcMain.handle('account-exist', () => {
  return storage.has('account');
});

ipcMain.handle('account-get-random-steamid', () => {
  return fromIndividualAccountID(nanoid()).getSteamID64();
});
