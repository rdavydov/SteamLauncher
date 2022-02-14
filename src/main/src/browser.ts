import {app, BrowserWindow, shell} from 'electron';
import log from 'electron-log';
import {paths, allowedExternalUrls} from './config.js';
import storage from './storage.js';

const environments = import.meta.env;
const viteServerUrl = 'http://localhost:3000/';

export const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 720,
    minWidth: 800,
    minHeight: 720,
    show: false,
    title: app.getName(),
    backgroundColor: '#161920',
    frame: environments.DEV,
    icon: paths.iconFilePath,
    webPreferences: {
      preload: paths.preloadFilePath,
      // SECURITY: disable devtools in production mode
      devTools: environments.DEV,
      // NOTE: local files are not displayed in developer mode
      webSecurity: environments.PROD,
    },
  });

  win.on('close', () => {
    storage.set('window.bounds', win.getBounds());
    storage.set('window.isMaximized', win.isMaximized());
    storage.set('window.isFullScreen', win.isFullScreen());
  });

  win.on('ready-to-show', () => {
    win.show();

    const windowIsMaximized = storage.get('window.isMaximized', false);
    if (windowIsMaximized) {
      win.maximize();
    }

    const windowIsFullScreen = storage.get('window.isFullScreen', false);
    if (windowIsFullScreen) {
      win.setFullScreen(true);
    }

    const windowBounds = storage.get('window.bounds', null);
    if (windowBounds !== null && win.isNormal()) {
      win.setBounds(windowBounds);
    }
  });

  const windowWhenChangeStateChannel = 'window-when-change-state';

  win.on('maximize', () => {
    win.webContents.send(windowWhenChangeStateChannel, true);
  });

  win.on('unmaximize', () => {
    win.webContents.send(windowWhenChangeStateChannel, false);
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.send(windowWhenChangeStateChannel, win.isMaximized());
  });

  win.webContents.openDevTools({
    mode: 'undocked',
  });

  if (environments.PROD) {
    win.removeMenu();
    win
      .loadFile(paths.renderFilePath, {
        hash: '#/',
      })
      .catch((error) => {
        log.error(error.message);
      });
  } else {
    win.loadURL(viteServerUrl).catch((error) => {
      log.error(error.message);
    });
  }

  return win;
};

export const openUrlExternal = (url: string) => {
  const parsedUrl = new URL(url);
  if (allowedExternalUrls.has(parsedUrl.origin)) {
    log.debug(url + ' is opened externally');
    setImmediate(async () => {
      return shell.openExternal(url);
    });
  }
};

const defaults = {createWindow, openUrlExternal};

export default defaults;
