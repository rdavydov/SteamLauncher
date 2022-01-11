import type {IpcMainEvent} from 'electron';
import {Buffer} from 'node:buffer';
import {readFileSync} from 'node:fs';
import config from '../config.js';
import showToast from './show-toast.js';

const gameDownloadHeaderImage = async (event: IpcMainEvent, url: string) => {
  const dataUri = 'data:image/jpg;charset=utf-8;base64,';
  const {default: fetch} = await import('node-fetch');

  try {
    const request = await fetch(url);
    if (request.ok) {
      const buffer = await request.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return `${dataUri}${base64}`;
    }
  } catch (error: unknown) {
    showToast(event, error as string, 'error');
  }

  const notFoundBuffer = readFileSync(config.paths.gameHeaderImageNotFound);
  const notFoundBase64 = Buffer.from(notFoundBuffer).toString('base64');
  return `${dataUri}${notFoundBase64}`;
};

export default gameDownloadHeaderImage;
