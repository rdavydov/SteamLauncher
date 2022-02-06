import {ipcMain, Menu, shell} from 'electron';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import config from '../config.js';
import gameGetData from '../functions/game-get-data.js';
import gameLauncher from '../functions/game-launcher.js';
import gameRemoveHandle from '../functions/game-remove-handle.js';
import showToast from '../functions/show-toast.js';

ipcMain.on('index-contextmenu-game', (event, appId: string) => {
  Menu.buildFromTemplate([
    {
      label: 'Launch',
      click: async () => {
        await gameLauncher(event, appId);
      },
    },
    {
      label: 'Launch normally',
      click: async () => {
        await gameLauncher(event, appId, true);
      },
    },
    {type: 'separator'},
    {
      label: 'Create desktop shortcut',
      click: () => {
        showToast(event, 'Not implemented yet', 'warning');
      },
    },
    {
      label: 'Open file location',
      click: () => {
        const data = gameGetData(appId);
        if (typeof data !== 'undefined') {
          shell.showItemInFolder(data.path as string);
        }
      },
    },
    {
      label: 'Open save location',
      click: async () => {
        const savesPath = join(config.paths.emulator.saves, appId);
        if (existsSync(savesPath)) {
          await shell.openPath(savesPath);
        } else {
          showToast(event, 'The emulator does not contain any save folders.', 'warning');
        }
      },
    },
    {type: 'separator'},
    {
      label: 'Edit',
      click: () => {
        event.sender.send('index-contextmenu-redirect', `/game/edit/${appId}`);
      },
    },
    {
      label: 'Delete',
      click: () => {
        gameRemoveHandle(event, appId);
      },
    },
  ]).popup();
});
