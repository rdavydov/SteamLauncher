import {ipcMain, Menu, shell} from 'electron';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {paths} from '../config.js';
import gameLauncher from '../functions/game-launcher.js';
import gameRemove from '../functions/game-remove.js';
import snack from '../functions/snack.js';
import storage from '../storage.js';

ipcMain.on('open-contextmenu-game', (event, appId: string) => {
  Menu.buildFromTemplate([
    {
      label: 'Launch',
      async click() {
        return gameLauncher(appId);
      },
    },
    {
      label: 'Launch normally',
      async click() {
        return gameLauncher(appId, true);
      },
    },
    {type: 'separator'},
    {
      label: 'Create desktop shortcut',
      click() {
        snack('Not implemented yet', 'warning');
      },
    },
    {
      label: 'Open file location',
      click() {
        const data: StoreGameDataType | undefined = storage.get('games.' + appId);
        if (typeof data !== 'undefined') {
          shell.showItemInFolder(data.path);
        }
      },
    },
    {
      label: 'Open save location',
      async click() {
        const savesPath = join(paths.emulator.saves, appId);
        if (existsSync(savesPath)) {
          await shell.openPath(savesPath);
        } else {
          snack('No game saves found!', 'warning');
        }
      },
    },
    {type: 'separator'},
    {
      label: 'Edit',
      click() {
        event.sender.send('app-navigate-to', `/game/edit/${appId}`);
      },
    },
    {
      label: 'Delete',
      click() {
        gameRemove(appId);
      },
    },
  ]).popup();
});
