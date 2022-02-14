import {execFile} from 'node:child_process';
import {paths} from '../config.js';

// NOTE: unused
const signVerify = (filePath: string) => {
  const signtool = paths.signtool;

  try {
    execFile(signtool, ['verify', '/pa', filePath]);
    return true;
  } catch {
    return false;
  }
};

export default signVerify;
