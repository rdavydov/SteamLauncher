import {
  BrowserWindow,
  ipcMain as ipc,
} from 'electron';

ipc.handle('window-close', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  currentWindow?.close();
});

ipc.handle('window-minimize', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  currentWindow?.minimize();
});

ipc.handle('window-maximize', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  currentWindow?.maximize();
});

ipc.handle('window-restore', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  currentWindow?.restore();
});
