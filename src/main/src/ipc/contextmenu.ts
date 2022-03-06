import {
  join,
} from 'node:path';
import {
  ipcMain as ipc,
  Menu,
  shell,
  app,
} from 'electron';
import {
  pathExists,
} from 'fs-extra';
import SteamRetriever from '../classes/steam-retriever';
import {
  paths,
} from '../config';
import gameLauncher from '../functions/game-launcher';
import gameRemove from '../functions/game-remove';
import notify from '../functions/notify';
import storage from '../storage';

ipc.on('open-contextmenu-game', (event, appId: string) => {
  const dataGame: StoreGameDataType = storage.get('games.' + appId);
  Menu.buildFromTemplate([
    {
      click () {
        gameLauncher(dataGame);
      },
      label: 'Launch',
    },
    {
      click () {
        gameLauncher(dataGame, true);
      },
      label: 'Launch normally',
    },
    {
      type: 'separator',
    },
    {
      click () {
        const name = dataGame.name.replace(/[^\d .A-Za-z]/gu, '');
        const to = join(app.getPath('desktop'), 'Launch ' + name + '.lnk');
        const created = shell.writeShortcutLink(to, {
          args: dataGame.appId,
          icon: dataGame.path,
          iconIndex: 0,
          target: app.getPath('exe'),
        });
        if (created) {
          notify('Shortcut created successfully on desktop!');
        } else {
          notify('Unknown error');
        }
      },
      label: 'Create desktop shortcut',
    },
    {
      async click () {
        if (await pathExists(dataGame.path)) {
          shell.showItemInFolder(dataGame.path);
        } else {
          notify('The game path does not exists!');
        }
      },
      label: 'Open file location',
    },
    {
      async click () {
        const savesPath = join(paths.emulator.saves, appId);
        if (await pathExists(savesPath)) {
          await shell.openPath(savesPath);
        } else {
          notify('The game saves does not exists!');
        }
      },
      label: 'Open save location',
    },
    {
      type: 'separator',
    },
    {
      async click () {
        const steamRetriever = new SteamRetriever(dataGame);
        await steamRetriever.run().then(() => {
          notify('Game rebased successfully!');
        });
      },
      label: 'Rebase DLCs, Items, etc...',
    },
    {
      type: 'separator',
    },
    {
      click () {
        event.sender.send('app-navigate-to', `/game/edit/${appId}`);
      },
      label: 'Edit game',
    },
    {
      click () {
        gameRemove(appId);
      },
      label: 'Remove game',
    },
  ]).popup();
});
