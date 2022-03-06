import type {
  IpcMainEvent,
} from 'electron';
import {
  ipcMain as ipc,
} from 'electron';
import SteamRetriever from '../classes/steam-retriever';
import {
  hiddenModalChannel,
} from '../config';
import notify from '../functions/notify';
import storage from '../storage';

const functionGameAddEdit = async (event: IpcMainEvent, inputs: StoreGameDataType) => {
  const key = 'games.' + inputs.appId;
  if (storage.has(key)) {
    const data: StoreGameDataType = storage.get(key);
    storage.set(key, Object.assign(data, inputs));
    notify('Game edited successfully!');
    event.sender.send(hiddenModalChannel);
  } else {
    const steamRetriever = new SteamRetriever(inputs);
    await steamRetriever.run().then(() => {
      notify('Game created successfully!');
    });
  }
};

ipc.on('game-add', functionGameAddEdit);
ipc.on('game-edit', functionGameAddEdit);

ipc.handle('game-data', (_event, appId: string): StoreGameDataType | undefined => {
  return storage.get('games.' + appId);
});

ipc.handle('games-data', () => {
  return storage.get('games');
});
