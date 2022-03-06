import type {
  IpcMainEvent,
} from 'electron';
import {
  ipcMain as ipc,
} from 'electron';
import {
  customAlphabet,
} from 'nanoid/non-secure';
import {
  fromIndividualAccountID,
} from 'steamid';
import {
  hiddenModalChannel,
} from '../config';
import notify from '../functions/notify';
import storage from '../storage';

const nanoid = customAlphabet('0123456789', 8);
const functionAccountCreateEdit = (event: IpcMainEvent, inputs: StoreAccountType) => {
  if (!fromIndividualAccountID(inputs.steamId).isValidIndividual()) {
    notify('Invalid ' + inputs.steamId + ' SteamId!');
    return;
  }

  storage.set('account', inputs);
  notify(storage.has('account') ? 'Account edited successfully!' : 'Account created successfully!');
  event.sender.send(hiddenModalChannel);
};

ipc.on('account-create', functionAccountCreateEdit);
ipc.on('account-edit', functionAccountCreateEdit);

ipc.handle('account-data', () => {
  return storage.get('account');
});

ipc.handle('account-exist', () => {
  return storage.has('account');
});

ipc.handle('account-get-random-steamid', () => {
  return fromIndividualAccountID(nanoid()).getSteamID64();
});
