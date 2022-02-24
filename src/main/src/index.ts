import {app, session, dialog} from 'electron';
import {argv} from 'node:process';
import {autoUpdater} from 'electron-updater';
import log from 'electron-log';
import './process.js';
import {appId} from '../../../electron-builder.json';
import browser from './browser.js';
import config from './config.js';
import './ipc/app.js';
import './ipc/window.js';
import './ipc/contextmenu.js';
import './ipc/account.js';
import './ipc/settings.js';
import './ipc/game.js';
import gameLauncher from './functions/game-launcher.js';
import storage from './storage.js';

log.info('App starting...');

// ENV
const environments = import.meta.env;

// SET LOG TO AUTOUPDATER
autoUpdater.logger = log;

// COMMANDS LINE
const commandsLine = argv.slice(environments.DEV ? 2 : 1);

// REQUEST SINGLE INSTANCE
if (!app.requestSingleInstanceLock() && commandsLine.length === 0) {
  log.error('Only single instances are allowed');
  app.quit();
}

// SET APP USER MODEL
app.setAppUserModelId(appId);
// DISABLE HARDWARE ACCELERATION
app.disableHardwareAcceleration();
// SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#4-enable-sandboxing
app.enableSandbox();

app.on('web-contents-created', (_event, contents) => {
  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#13-disable-or-limit-navigation
  contents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    if (!config.allowedWillNavigateUrls.has(parsedUrl.origin)) {
      log.error('will-navigate: ' + parsedUrl.href + " isn't allowed");
      event.preventDefault();
    }

    browser.openUrlExternal(url);
  });

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#14-disable-or-limit-creation-of-new-windows
  // NOTE: this happen when link have target="_blank"
  contents.setWindowOpenHandler(({url}) => {
    browser.openUrlExternal(url);
    return {action: 'deny'};
  });
});

app.on('second-instance', () => {
  app.focus();
});

app
  .whenReady()
  .then(() => {
    // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#5-handle-session-permission-requests-from-remote-content
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      log.debug(permission + ' permission is not granted');
      callback(false);
    });
  })
  .then(async () => {
    if (commandsLine.length > 0) {
      const appId = commandsLine[0];
      const has = storage.has('games.' + appId);
      if (has) {
        const data: StoreGameDataType = storage.get('games.' + appId);
        await gameLauncher(data);
      } else {
        dialog.showErrorBox('Error', appId + ' does not exist!');
      }

      app.exit();
    } else {
      autoUpdater.checkForUpdatesAndNotify().catch((error) => {
        log.error(error.message);
      });

      browser.createWindow();
    }
  })
  .catch((error) => {
    log.error(error.message);
  });
