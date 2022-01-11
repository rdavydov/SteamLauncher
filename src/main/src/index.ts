import {app, session} from 'electron';
import {appId} from '../../../electron-builder.json';
import windowNew from './functions/window-new.js';
import windowNavigateTo from './functions/window-navigate-to.js';
import config from './config.js';
import './before-ready.js';

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.setAppUserModelId(appId);
app.disableHardwareAcceleration();
// SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#4-enable-sandboxing
app.enableSandbox();

app.on('web-contents-created', (_event, contents) => {
  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#13-disable-or-limit-navigation
  contents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    if (!config.allowedWillNavigateUrls.has(parsedUrl.origin)) {
      event.preventDefault();
    }

    windowNavigateTo(url);
  });

  // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#14-disable-or-limit-creation-of-new-windows
  // NOTE: this happen when link have target="_blank"
  contents.setWindowOpenHandler(({url}) => {
    windowNavigateTo(url);
    return {action: 'deny'};
  });
});

app.on('second-instance', () => {
  app.focus();
});

app
  .whenReady()
  .then(windowNew)
  .then(() => {
    // SECURITY: https://www.electronjs.org/docs/latest/tutorial/security/#5-handle-session-permission-requests-from-remote-content
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
      // Callback(['notifications'].includes(permission));
      callback(false);
    });
  })
  .catch(console.error);
