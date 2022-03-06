import {
  execFileSync,
} from 'node:child_process';
import {
  parse,
} from 'node:path';
import {
  paths,
} from '../config';

const steamApiInterfaces = (filePath: string) => {
  const exe = paths.steamApiInterfacesBin;
  const parsed = parse(filePath);

  try {
    execFileSync(exe, [
      parsed.base,
    ], {
      cwd: paths.steamApiInterfacesPath,
    });
    return true;
  } catch {
    return false;
  }
};

export default steamApiInterfaces;
