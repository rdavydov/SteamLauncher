import {app} from 'electron';
import {join} from 'node:path';

const environments = import.meta.env;
const appPath = app.getAppPath();
const appDataPath = app.getPath('appData');
const binPath = join(appPath + (environments.PROD ? '.unpacked' : ''), 'bin/win');

export const paths = {
  signToolBin: join(binPath, 'signtool/signtool.exe'),
  steamApiInterfacesBin: join(binPath, 'steam_api_interfaces/steam_api_interfaces.exe'),
  steamApiInterfacesPath: join(binPath, 'steam_api_interfaces'),
  steamRetrieverBin: join(binPath, 'steam_retriever/steam_retriever.exe'),
  steamRetrieverPath: join(binPath, 'steam_retriever'),
  preloadFilePath: join(appPath, '/src/preload/dist/index.js'),
  renderFilePath: join(appPath, '/src/render/dist/index.html'),
  iconFilePath: join(appPath, '/build/resources/icon.ico'),
  emulator: {
    saves: join(appDataPath, 'Goldberg SteamEmu Saves'),
  },
};

export const allowedWillNavigateUrls = new Set(['http://localhost:3000']);

export const allowedExternalUrls = new Set([
  'https://www.paypal.com',
  'https://github.com',
  'https://gitlab.com',
  'https://cs.rin.ru',
  'https://steamcommunity.com',
]);

export const hiddenModalChannel = 'hidden-modal-channel';

const defaults = {
  paths,
  allowedWillNavigateUrls,
  allowedExternalUrls,
  hiddenModalChannel,
};

export default defaults;
