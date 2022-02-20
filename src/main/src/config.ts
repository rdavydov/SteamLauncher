import {app} from 'electron';
import {join} from 'node:path';

const environments = import.meta.env;
const appPath = app.getAppPath();
const appDataPath = app.getPath('appData');
const binPath = appPath + (environments.PROD ? '.unpacked' : '');

export const paths = {
  signToolBin: join(binPath, '/bin/win/signtool/signtool.exe'),
  steamApiInterfacesBin: join(binPath, '/bin/win/steam_api_interfaces/steam_api_interfaces.exe'),
  steamApiInterfacesPath: join(binPath, '/bin/win/steam_api_interfaces'),
  steamRetrieverBin: join(binPath, '/bin/win/steam_retriever/steam_retriever.exe'),
  steamRetrieverPath: join(binPath, '/bin/win/steam_retriever'),
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

export const closeModalChannel = 'close-modal';

const defaults = {paths, allowedWillNavigateUrls, allowedExternalUrls, closeModalChannel};

export default defaults;
