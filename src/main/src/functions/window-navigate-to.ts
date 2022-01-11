import {shell} from 'electron';
import config from '../config.js';

const windowNavigate = (url: string) => {
  const parsedUrl = new URL(url);
  if (config.allowedUrls.has(parsedUrl.origin)) {
    setImmediate(async () => {
      return shell.openExternal(url);
    });
  }
};

export default windowNavigate;
