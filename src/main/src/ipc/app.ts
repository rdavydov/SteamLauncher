import {
  parse,
} from 'node:path';
import {
  app,
  ipcMain as ipc,
  dialog,
  BrowserWindow,
} from 'electron';
import MarkDownIt from 'markdown-it';
import readme from '../../../../README.md?raw';
import {
  author as packageAuthor,
} from '../../../../package.json';
import notify from '../functions/notify';

const markdown = new MarkDownIt({
  html: true,
  linkify: true,
});

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

ipc.handle('app-notify', (_event, message) => {
  notify(message);
});

ipc.handle('app-file-path-parse', (_event, filePath: string) => {
  return {
    ...parse(filePath),
    fullPath: filePath,
  };
});

ipc.handle('app-chose-directory', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  // TODO: to async
  // eslint-disable-next-line node/no-sync
  return dialog.showOpenDialogSync(currentWindow!, {
    properties: [
      'openDirectory',
    ],
  });
});

ipc.handle('app-chose-file', (event) => {
  const currentWindow = BrowserWindow.fromId(event.frameId);
  // TODO: to async
  // eslint-disable-next-line node/no-sync
  return dialog.showOpenDialogSync(currentWindow!, {
    properties: [
      'openFile',
    ],
  });
});
