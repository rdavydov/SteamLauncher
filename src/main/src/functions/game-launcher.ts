// Import {webContents} from 'electron';
import {join} from 'node:path';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import ini from 'ini';
import {emptyDirSync, copySync} from 'fs-extra';
// Import log from 'electron-log';
import {paths} from '../config.js';
import storage from '../storage.js';
import snack from './snack.js';

const gameLauncher = async (appId: string, normally = false) => {
  // Const event = webContents.getFocusedWebContents();
  const dataGame: StoreGameDataType = storage.get('games.' + appId);
  const dataAccount: Record<string, string> | undefined = storage.get('account');
  const dataNetwork = storage.get('network');
  // Const dataSettings = storage.get('settings');

  if (dataGame === null && typeof dataAccount === 'undefined') {
    snack(`Unknown error (dataGame, dataAccount)!`, 'error');
    return;
  }

  const dataGamePath = dataGame.path;
  const dataGameRunPath = dataGame.runPath;
  const dataGameCommandLine = dataGame.path;
  // Const dataGameDlcs = dataGame?.dlcs as Record<string, string>;

  if (normally) {
    execFile(dataGamePath, dataGameCommandLine.split(' '));
    snack(`Launch ${dataGamePath}`, 'success');
    return;
  }

  const emulatorLoaderPath = paths.emulator.loader;
  if (!existsSync(emulatorLoaderPath)) {
    snack(`Missing ${emulatorLoaderPath}`, 'error');
    return;
  }

  const emulatorSteamClientPath = paths.emulator.steamclient;
  if (!existsSync(emulatorSteamClientPath)) {
    snack(`Missing ${emulatorSteamClientPath}`, 'error');
    return;
  }

  const emulatorSteamClient64Path = paths.emulator.steamclient64;
  if (!existsSync(emulatorSteamClient64Path)) {
    snack(`Missing ${emulatorSteamClient64Path}`, 'error');
    return;
  }

  const asd = join(paths.dataPath, 'apps', appId);
  const asdTo = paths.emulator.settings.path;

  copySync(asd, asdTo); /*
    .then(() => {
      snack('the plm ' + asdTo);
      log.debug(asdTo);
    })
    .catch((error) => {
      snack(error.message);
      log.debug(error.message);
    }); */

  const emulatorLoaderConfigPath = paths.emulator.loaderConfig;

  const loaderConfig = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SteamClient: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Exe: dataGamePath,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ExeRunDir: dataGameRunPath,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ExeCommandLine: dataGameCommandLine,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      AppId: appId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      SteamClientDll: emulatorSteamClientPath,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      SteamClient64Dll: emulatorSteamClient64Path,
    },
  };

  writeFileSync(emulatorLoaderConfigPath, ini.stringify(loaderConfig));

  const emulatorSettingsPath = paths.emulator.settings.path;

  if (existsSync(emulatorSettingsPath)) {
    emptyDirSync(emulatorSettingsPath);
  } else {
    mkdirSync(emulatorSettingsPath);
  }

  const emulatorSettingsForceAccountName = paths.emulator.settings.forceAccountName;
  const emulatorSettingsForceLanguage = paths.emulator.settings.forceLanguage;
  const emulatorSettingsForceSteamId = paths.emulator.settings.forceSteamId;

  writeFileSync(emulatorSettingsForceAccountName, dataAccount!.name);
  writeFileSync(emulatorSettingsForceLanguage, dataAccount!.language);
  writeFileSync(emulatorSettingsForceSteamId, dataAccount!.steamId);

  /* Const emulatorSettingsForceListenPort = paths.emulator.settings.forceListenPort;
  const emulatorSettingsOverlay = paths.emulator.settings.overlay;

  writeFileSync(emulatorSettingsForceListenPort, dataSettings.listenPort);

  if (!dataSettings.overlay) {
    writeFileSync(emulatorSettingsOverlay, '');
  } */

  const emulatorSettingsDisableNetworking = paths.emulator.settings.disableNetworking;
  const emulatorSettingsOffline = paths.emulator.settings.offline;

  if (!dataNetwork) {
    writeFileSync(emulatorSettingsDisableNetworking, '');
    writeFileSync(emulatorSettingsOffline, '');
  }

  /* Const emulatorSettingsDlc = config.paths.emulator.settings.dlc;

  if (Object.keys(dataGameDlcs).length > 0) {
    writeFileSync(emulatorSettingsDlc, dlcsToMustacheTemplate(dataGameDlcs).join('\n'));
  } */

  execFile(emulatorLoaderPath);

  snack(`Launch ${dataGamePath}`, 'success');
};

export default gameLauncher;
