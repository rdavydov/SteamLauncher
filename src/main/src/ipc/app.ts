import {app, ipcMain} from 'electron';
import {parse} from 'node:path';
import MarkDownIt from 'markdown-it';
import {author as packageAuthor} from '../../../../package.json';
import readme from '../../../../README.md?raw';

const markdown = new MarkDownIt({linkify: true, html: true});

ipcMain.handle('app-get-version', () => {
  return app.getVersion();
});

ipcMain.handle('app-get-name', () => {
  return app.getName();
});

ipcMain.handle('app-get-description', () => {
  return markdown.render(readme);
});

ipcMain.handle('app-get-copyright', () => {
  return `Copyright © ${new Date().getUTCFullYear()} ${packageAuthor.name}`;
});

ipcMain.handle('app-file-path-parse', (_event, filePath: string) => {
  return Object.assign({}, parse(filePath), {fullPath: filePath});
});
