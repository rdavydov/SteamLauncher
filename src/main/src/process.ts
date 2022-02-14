import process from 'node:process';
import log from 'electron-log';

process.on('unhandledRejection', log.error);
process.on('uncaughtException', log.error);
