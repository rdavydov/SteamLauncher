import {ipcMain} from 'electron';
import gamesGetData from '../functions/games-get-data.js';

ipcMain.handle('games-data', () => {
  return gamesGetData();
});
