import {ipcMain, IpcMainEvent} from 'electron';
import SteamRetriever from '../classes/steam-retriever.js';
import storage from '../storage.js';
import snack from '../functions/snack.js';
import {hiddenModalChannel} from '../config.js';

const fnGameAddEdit = async (event: IpcMainEvent, inputs: StoreGameDataType) => {
  const key = 'games.' + inputs.appId;
  if (storage.has(key)) {
    const data: StoreGameDataType = storage.get(key);
    storage.set(key, Object.assign(data, inputs));
    snack('Game edited successfully!', 'success');
    event.sender.send(hiddenModalChannel);
  } else {
    const steamRetriever = new SteamRetriever(inputs);
    await steamRetriever.run().then(() => {
      snack('Game created successfully!', 'success');
    });
  }
};

ipcMain.on('game-add', fnGameAddEdit);
ipcMain.on('game-edit', fnGameAddEdit);

ipcMain.handle('game-data', (_event, appId: string): StoreGameDataType | undefined => {
  return storage.get('games.' + appId);
});

ipcMain.handle('games-data', () => {
  return storage.get('games');
});
