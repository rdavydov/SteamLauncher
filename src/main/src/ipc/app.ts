import {app, ipcMain as ipc, dialog, BrowserWindow} from 'electron';
import {parse} from 'node:path';
import MarkDownIt from 'markdown-it';
import {author as packageAuthor} from '../../../../package.json';
import readme from '../../../../README.md?raw';

const markdown = new MarkDownIt({linkify: true, html: true});

ipc.handle('app-get-version', () => {
  return app.getVersion();
});

ipc.handle('app-get-name', () => {
  return app.getName();
});

ipc.handle('app-get-description', () => {
  return markdown.render(readme);
});

ipc.handle('app-get-copyright', () => {
  return `Copyright © ${new Date().getUTCFullYear()} ${packageAuthor.name}`;
});

ipc.handle('app-file-path-parse', (_event, filePath: string) => {
  return Object.assign({}, parse(filePath), {fullPath: filePath});
});

ipc.handle('app-chose-directory', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  return dialog.showOpenDialogSync(currentWindow!, {properties: ['openDirectory']});
});

ipc.handle('app-chose-file', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  return dialog.showOpenDialogSync(currentWindow!, {properties: ['openFile']});
});
