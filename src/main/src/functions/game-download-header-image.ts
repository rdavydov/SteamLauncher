import type {IpcMainEvent} from 'electron';
import {Buffer} from 'node:buffer';
// Import {readFileSync} from 'node:fs';
import axios from 'axios';
// Import config from '../config.js';
import showToast from './show-toast.js';

const gameDownloadHeaderImage = async (event: IpcMainEvent, url: string) => {
  const dataUri = 'data:image/jpg;charset=utf-8;base64,';

  try {
    const request = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    if (request.status === 200) {
      const buffer = request.data as ArrayBuffer;
      const base64 = Buffer.from(buffer).toString('base64');
      return `${dataUri}${base64}`;
    }
  } catch (error: unknown) {
    showToast(event, error as string, 'error');
  }

  /* Const notFoundBuffer = readFileSync(config.paths.gameHeaderImageNotFound);
  const notFoundBase64 = Buffer.from(notFoundBuffer).toString('base64'); */
  return ``;
};

export default gameDownloadHeaderImage;
