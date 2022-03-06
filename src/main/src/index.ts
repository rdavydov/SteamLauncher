import {
  argv,
} from 'node:process';
import {
  app,
  session,
  dialog,
} from 'electron';
import log from 'electron-log';
import {
  autoUpdater,
} from 'electron-updater';
import './process';
import {
  appId,
} from '../../../electron-builder.json';
import browser from './browser';
import config from './config';
import gameLauncher from './functions/game-launcher';
import storage from './storage';
import './ipc/app';
import './ipc/window';
import './ipc/contextmenu';
import './ipc/account';
import './ipc/settings';
import './ipc/game';

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
      log.error('will-navigate: ' + parsedUrl.href + ' isn\'t allowed');
      event.preventDefault();
    }

    browser.openUrlExternal(url);
  });

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#14-disable-or-limit-creation-of-new-windows
  // NOTE: this happen when link have target="_blank"
  contents.setWindowOpenHandler(({
    url,
  }) => {
    browser.openUrlExternal(url);
    return {
      action: 'deny',
    };
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
      const pass = false;
      log.debug(permission + ' permission is not granted');
      callback(pass);
    });
  })
  .then(async () => {
    if (commandsLine.length > 0) {
      const argumentAppId = commandsLine[0];
      const has = storage.has('games.' + argumentAppId);
      if (has) {
        const data: StoreGameDataType = storage.get('games.' + argumentAppId);
        gameLauncher(data);
      } else {
        dialog.showErrorBox('Error', argumentAppId + ' does not exist!');
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
