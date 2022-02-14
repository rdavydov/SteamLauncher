import {app, session} from 'electron';
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

log.info('App starting...');

// ENV
const environments = import.meta.env;

// SET LOG TO AUTOUPDATER
autoUpdater.logger = log;

// REQUEST SINGLE INSTANCE
if (!app.requestSingleInstanceLock()) {
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
  .then(async () => {
    log.debug(
      'isProduction: ' +
        environments.PROD.toString() +
        '; isPackaged: ' +
        app.isPackaged.toString(),
    );
    if (environments.PROD && !app.isPackaged) {
      log.info('Check for updates...');
      await autoUpdater.checkForUpdatesAndNotify();
    }
  })
  .then(browser.createWindow)
  .then(() => {
    // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#5-handle-session-permission-requests-from-remote-content
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      log.debug(permission + ' permission is not granted');
      callback(false);
    });
  })
  .catch((error) => {
    log.error(error.message);
  });
