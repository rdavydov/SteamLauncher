import {app, BrowserWindow, shell} from 'electron';
import log from 'electron-log';
import config from './config.js';
import storage from './storage.js';

const environments = import.meta.env;

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
    icon: config.paths.iconFilePath,
    webPreferences: {
      preload: config.paths.preloadFilePath,
      // SECURITY: deny devtools in production mode
      devTools: environments.DEV,
      // TODO: webSecurity: false for loading local images
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

  // SECURITY: denied in options
  win.webContents.openDevTools({
    mode: 'undocked',
  });

  if (environments.PROD) {
    win.removeMenu();
    win
      .loadFile(config.paths.renderFilePath, {
        hash: '#/',
      })
      .catch(log.error);
  } else {
    win.loadURL('http://localhost:3000/').catch(log.error);
  }

  return win;
};

export const openUrlExternal = (url: string) => {
  const parsedUrl = new URL(url);
  if (config.allowedUrls.has(parsedUrl.origin)) {
    log.debug(url + ' is opened externally');
    setImmediate(async () => {
      return shell.openExternal(url);
    });
  }
};

const defaults = {createWindow, openUrlExternal};

export default defaults;
