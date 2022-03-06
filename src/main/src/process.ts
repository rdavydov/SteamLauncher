import process from 'node:process';
import log from 'electron-log';

process.on('uncaughtException', (error) => {
  log.error(error);
});
