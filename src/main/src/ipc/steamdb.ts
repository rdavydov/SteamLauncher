import {ipcMain} from 'electron';
import steamDbGetData from '../functions/steamdb-get-data.js';

ipcMain.handle('steamdb-get-data', async (_event, appId: string) => {
  return steamDbGetData(appId);
});
