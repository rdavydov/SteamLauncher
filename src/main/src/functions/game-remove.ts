import {webContents} from 'electron';
import storage from '../storage.js';
import snack from './snack.js';

const gameRemove = (appId: string) => {
  const data = storage.get('games');
  if (typeof data !== 'undefined') {
    const name = data[appId].name;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete data[appId];
    storage.set(`games`, data);
    snack(name + ' removed successfully!', 'success');
    webContents.getFocusedWebContents().send('index-reload-games-list');
  }
};

export default gameRemove;
