import {
  execFile,
} from 'node:child_process';
import {
  paths,
} from '../config';

const signVerify = (filePath: string) => {
  const exe = paths.signToolBin;

  try {
    execFile(exe, [
      'verify',
      '/pa',
      filePath,
    ]);
    return true;
  } catch {
    return false;
  }
};

export default signVerify;
