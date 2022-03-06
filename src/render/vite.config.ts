import {
  fileURLToPath,
} from 'node:url';
// eslint-disable-next-line import/extensions
import createConfig from '../../vite.config';

const path = fileURLToPath(new URL('.', import.meta.url));

export default createConfig(path);
