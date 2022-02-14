import {app} from 'electron';
import {join} from 'node:path';

const environments = import.meta.env;
// Const resourcePath = environments.DEV ? app.getAppPath() : join(app.getAppPath(), '../../');
const appDataPath = app.getPath('appData');
const appUserDataPath = app.getPath('userData');
const dataPath = join(appUserDataPath, 'data');
const emulatorPath = join(dataPath, 'emulator');
const emulatorSettingsPath = join(emulatorPath, 'steam_settings');

export const paths = {
  signtool: join(
    app.getAppPath() + (environments.PROD ? '.unpacked' : ''),
    '/bin/win/signtool/signtool.exe',
  ),
  steamRetriever: join(
    app.getAppPath() + (environments.PROD ? '.unpacked' : ''),
    '/bin/win/steam_retriever/steam_retriever.exe',
  ),
  preloadFilePath: join(app.getAppPath(), '/src/preload/dist/index.js'),
  renderFilePath: join(app.getAppPath(), '/src/render/dist/index.html'),
  iconFilePath: join(app.getAppPath(), '/build/resources/icon.ico'),
  dataPath,
  emulator: {
    settings: {
      path: join(emulatorPath, 'steam_settings'),
      forceAccountName: join(emulatorSettingsPath, 'force_account_name.txt'),
      forceLanguage: join(emulatorSettingsPath, 'force_language.txt'),
      forceSteamId: join(emulatorSettingsPath, 'force_steamid.txt'),
      forceListenPort: join(emulatorSettingsPath, 'force_listen_port.txt'),
      overlay: join(emulatorSettingsPath, 'disable_overlay.txt'),
      disableNetworking: join(emulatorSettingsPath, 'disable_networking.txt'),
      offline: join(emulatorSettingsPath, 'offline.txt'),
      dlc: join(emulatorSettingsPath, 'DLC.txt'),
    },
    loader: join(emulatorPath, 'steamclient_loader.exe'),
    loaderConfig: join(emulatorPath, 'ColdClientLoader.ini'),
    steamclient: join(emulatorPath, 'steamclient.dll'),
    steamclient64: join(emulatorPath, 'steamclient64.dll'),
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
