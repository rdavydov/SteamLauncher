import {app, BrowserWindow} from 'electron';
import config from '../config.js';
import storage from './storage.js';

const environments = import.meta.env;

const windowNew = () => {
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

  if (environments.PROD) {
    win.removeMenu();
  }

  win
    .loadFile(config.paths.renderFilePath, {
      hash: '#/',
    })
    .then(() => {
      if (environments.DEV) {
        win.webContents.openDevTools({
          mode: 'undocked',
        });
      }
    })
    .catch(console.error);

  return win;
};

export default windowNew;
