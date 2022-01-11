import {ipcMain, Menu, shell} from 'electron';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import config from '../config.js';
import gameGetData from '../functions/game-get-data.js';
import gameLauncher from '../functions/game-launcher.js';
import gameRemoveHandle from '../functions/game-remove-handle.js';
import showToast from '../functions/show-toast.js';

const mdiPlayCircle = join(config.paths.contextMenuIcons, 'mdi-play-circle.png');
const mdiLinkVariant = join(config.paths.contextMenuIcons, 'mdi-link-variant.png');
const mdiSquareEditOnline = join(config.paths.contextMenuIcons, 'mdi-square-edit-outline.png');
const mdiDelete = join(config.paths.contextMenuIcons, 'mdi-delete.png');

ipcMain.on('game-contextmenu-show', (event, appId: string) => {
  Menu.buildFromTemplate([
    {
      label: 'Launch',
      icon: mdiPlayCircle,
      click: async () => {
        await gameLauncher(event, appId);
      },
    },
    {
      label: 'Launch normally',
      icon: mdiPlayCircle,
      click: async () => {
        await gameLauncher(event, appId, true);
      },
    },
    {type: 'separator'},
    {
      label: 'Create desktop shortcut',
      icon: mdiLinkVariant,
      click: () => {
        showToast(event, 'Not implemented yet', 'warning');
      },
    },
    {
      label: 'Open file location',
      icon: mdiLinkVariant,
      click: () => {
        const data = gameGetData(appId);
        if (typeof data !== 'undefined') {
          shell.showItemInFolder(data.path as string);
        }
      },
    },
    {
      label: 'Open save location',
      icon: mdiLinkVariant,
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
      icon: mdiSquareEditOnline,
      click: () => {
        event.sender.send('game-contextmenu-redirect', `/game/edit/${appId}`);
      },
    },
    {
      label: 'Delete',
      icon: mdiDelete,
      click: () => {
        gameRemoveHandle(event, appId);
      },
    },
  ]).popup();
});
