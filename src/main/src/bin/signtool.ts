import {execFile} from 'node:child_process';
import config from '../config.js';

// NOTE: unused
const signVerify = (filePath: string) => {
  const signtool = config.paths.signtool;

  try {
    execFile(signtool, ['verify', '/pa', filePath]);
    return true;
  } catch {
    return false;
  }
};

export default signVerify;
