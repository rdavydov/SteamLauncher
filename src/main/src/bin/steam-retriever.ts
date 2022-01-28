import {execFile} from 'node:child_process';
import config from '../config.js';

// NOTE: unused
const signVerify = (filePath: string) => {
  const steamRetriever = config.paths.steamRetriever;

  try {
    execFile(steamRetriever, ['verify', '/pa', filePath]);
    return true;
  } catch {
    return false;
  }
};

export default signVerify;
