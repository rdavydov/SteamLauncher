import {ipcMain, Menu, shell, app} from 'electron';
import {join} from 'node:path';
import {pathExists} from 'fs-extra';
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
      click() {
        gameLauncher(dataGame);
      },
    },
    {
      label: 'Launch normally',
      click() {
        gameLauncher(dataGame, true);
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
          snack('Shortcut created successfully on desktop!', 'success');
        } else {
          snack('Unknown error', 'error');
        }
      },
    },
    {
      label: 'Open file location',
      async click() {
        if (await pathExists(dataGame.path)) {
          shell.showItemInFolder(dataGame.path);
        } else {
          snack('The game path does not exists!', 'warning');
        }
      },
    },
    {
      label: 'Open save location',
      async click() {
        const savesPath = join(paths.emulator.saves, appId);
        if (await pathExists(savesPath)) {
          await shell.openPath(savesPath);
        } else {
          snack('The game saves does not exists!', 'warning');
        }
      },
    },
    {type: 'separator'},
    {
      label: 'Rebase DLCs, Items, etc...',
      async click() {
        const steamRetriever = new SteamRetriever(dataGame);
        await steamRetriever.run().then(() => {
          snack('Game rebased successfully!', 'success');
        });
      },
    },
    {type: 'separator'},
    {
      label: 'Edit game',
      click() {
        event.sender.send('app-navigate-to', `/game/edit/${appId}`);
      },
    },
    {
      label: 'Remove game',
      click() {
        gameRemove(appId);
      },
    },
  ]).popup();
});
