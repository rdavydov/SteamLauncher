import {app} from 'electron';
import {join} from 'node:path';
import log from 'electron-log';

const environments = import.meta.env;
const resourcePath = environments.DEV ? app.getAppPath() : join(app.getAppPath(), '../../');
const appDataPath = app.getPath('appData');
const appUserDataPath = app.getPath('userData');
const dataPath = join(appUserDataPath, 'data');
const emulatorPath = join(dataPath, 'emulator');
const emulatorSettingsPath = join(emulatorPath, 'steam_settings');
const publicPath = environments.DEV ? 'src/public' : 'dist';

const config = {
  paths: {
    gameHeaderImageNotFound: join(
      app.getAppPath(),
      'src/render/',
      publicPath,
      '/assets/images/gameHeaderImageDefault.jpg',
    ),
    contextMenuIcons: join(
      app.getAppPath(),
      'src/render/',
      publicPath,
      '/assets/images/icons/contextmenu',
    ),
    signtool: join(resourcePath, '/bin/win/signtool.exe'),
    preloadFilePath: join(app.getAppPath(), 'src/preload/dist/index.js'),
    renderFilePath: join(app.getAppPath(), 'src/render/dist/index.html'),
    iconFilePath: join(app.getAppPath(), 'src/render/', publicPath, '/favicon.ico'),
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
      saves: join(appDataPath, 'Goldberg SteamEmu Saves'),
      loader: join(emulatorPath, 'steamclient_loader.exe'),
      loaderConfig: join(emulatorPath, 'ColdClientLoader.ini'),
      steamclient: join(emulatorPath, 'steamclient.dll'),
      steamclient64: join(emulatorPath, 'steamclient64.dll'),
    },
  },
  allowedUrls: new Set([
    'https://www.paypal.com',
    'https://github.com',
    'https://gitlab.com',
    'https://cs.rin.ru',
  ]),
  allowedWillNavigateUrls: new Set(['https://steamdb.info', 'http://localhost:3000']),
};

log.debug(config);

export default config;
