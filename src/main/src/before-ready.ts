import {mkdirSync, existsSync} from 'node:fs';
import config from './config.js';
// Set IPC's
import './ipc/app.js';
import './ipc/window.js';
import './ipc/contextmenu.js';
import './ipc/account.js';
import './ipc/settings.js';
import './ipc/games.js';
import './ipc/game.js';
import './ipc/steamdb.js';

const emulatorPath = config.paths.emulator.path;

if (!existsSync(emulatorPath)) {
  mkdirSync(emulatorPath);
}
