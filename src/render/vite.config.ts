import {fileURLToPath} from 'node:url';
import createConfig from '../../vite.config.js';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

export default createConfig(_dirname);
