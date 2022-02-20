import {parse} from 'node:path';
import {execFileSync} from 'node:child_process';
import {paths} from '../config.js';

const steamApiInterfaces = (filePath: string) => {
  const exe = paths.steamApiInterfacesBin;
  const parsed = parse(filePath);

  try {
    execFileSync(exe, [parsed.base], {cwd: paths.steamApiInterfacesPath});
    return true;
  } catch {
    return false;
  }
};

export default steamApiInterfaces;
