import {ipcMain, Menu, shell, app} from 'electron';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import SteamRetriever from '../classes/steam-retriever.js';
import {paths} from '../config.js';
import gameLauncher from '../functions/game-launcher.js';
import gameRemove from '../functions/game-remove.js';
import snack from '../functions/snack.js';
import storage from '../storage.js';

ipcMain.on('open-contextmenu-game', (event, appId: string) => {
  const dataGame: StoreGameDataType = storage.get('games.' + appId);
  Menu.buildFromTemplate([
    {
      label: 'Launch',
      async click() {
        return gameLauncher(dataGame);
      },
    },
    {
      label: 'Launch normally',
      async click() {
        return gameLauncher(dataGame, true);
      },
    },
    {type: 'separator'},
    {
      label: 'Create desktop shortcut',
      click() {
        const name = dataGame.name.replace(/[^\da-zA-Z. ]/g, '');
        const to = join(app.getPath('desktop'), 'Launch ' + name + '.lnk');
        const created = shell.writeShortcutLink(to, {
          target: app.getPath('exe'),
          args: dataGame.appId,
          icon: dataGame.path,
          iconIndex: 0,
        });
        if (created) {
          snack('Shortcut created successfully on desktop!');
        } else {
          snack('Unknown error');
        }
      },
    },
    {
      label: 'Open file location',
      click() {
        shell.showItemInFolder(dataGame.path);
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
      label: 'Rebase DLCs, Items, etc...',
      async click() {
        const steamRetriever = new SteamRetriever(dataGame);
        await steamRetriever.run();
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
