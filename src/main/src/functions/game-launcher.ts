import {IpcMainEvent} from 'electron';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import ini from 'ini';
import {emptyDirSync} from 'fs-extra';
import config from '../config.js';
import dlcsToMustacheTemplate from '../../../render/src/functions/dlcs-to-mustache-template.js';
import storage from './storage.js';
import gameGetData from './game-get-data.js';
import showToast from './show-toast.js';

const gameLauncher = async (event: IpcMainEvent, appId: string, normally = false) => {
  const dataGame = gameGetData(appId);
  const dataAccount: Record<string, string> | undefined = storage.get('account');
  const dataNetwork = storage.get('network');
  const dataSettings = storage.get('settings');

  if (dataGame === null && typeof dataAccount === 'undefined') {
    showToast(event, `Unknown error (dataGame, dataAccount)!`, 'error');
    return;
  }

  const dataGamePath = dataGame?.path as string;
  const dataGameRunPath = dataGame?.runPath as string;
  const dataGameCommandLine = dataGame?.path as string;
  const dataGameDlcs = dataGame?.dlcs as Record<string, string>;

  if (normally) {
    execFile(dataGamePath, dataGameCommandLine.split(' '));
    showToast(event, `Launch ${dataGamePath}`, 'success');
    return;
  }

  const emulatorLoaderPath = config.paths.emulator.loader;
  if (!existsSync(emulatorLoaderPath)) {
    showToast(event, `Missing ${emulatorLoaderPath}`, 'error');
    return;
  }

  const emulatorSteamClientPath = config.paths.emulator.steamclient;
  if (!existsSync(emulatorSteamClientPath)) {
    showToast(event, `Missing ${emulatorSteamClientPath}`, 'error');
    return;
  }

  const emulatorSteamClient64Path = config.paths.emulator.steamclient64;
  if (!existsSync(emulatorSteamClient64Path)) {
    showToast(event, `Missing ${emulatorSteamClient64Path}`, 'error');
    return;
  }

  const emulatorLoaderConfigPath = config.paths.emulator.loaderConfig;

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

  const emulatorSettingsPath = config.paths.emulator.settings.path;

  if (existsSync(emulatorSettingsPath)) {
    emptyDirSync(emulatorSettingsPath);
  } else {
    mkdirSync(emulatorSettingsPath);
  }

  const emulatorSettingsForceAccountName = config.paths.emulator.settings.forceAccountName;
  const emulatorSettingsForceLanguage = config.paths.emulator.settings.forceLanguage;
  const emulatorSettingsForceSteamId = config.paths.emulator.settings.forceSteamId;

  writeFileSync(emulatorSettingsForceAccountName, dataAccount!.name);
  writeFileSync(emulatorSettingsForceLanguage, dataAccount!.language);
  writeFileSync(emulatorSettingsForceSteamId, dataAccount!.steamId);

  const emulatorSettingsForceListenPort = config.paths.emulator.settings.forceListenPort;
  const emulatorSettingsOverlay = config.paths.emulator.settings.overlay;

  writeFileSync(emulatorSettingsForceListenPort, dataSettings.listenPort);

  if (!dataSettings.overlay) {
    writeFileSync(emulatorSettingsOverlay, '');
  }

  const emulatorSettingsDisableNetworking = config.paths.emulator.settings.disableNetworking;
  const emulatorSettingsOffline = config.paths.emulator.settings.offline;

  if (!dataNetwork) {
    writeFileSync(emulatorSettingsDisableNetworking, '');
    writeFileSync(emulatorSettingsOffline, '');
  }

  const emulatorSettingsDlc = config.paths.emulator.settings.dlc;

  if (Object.keys(dataGameDlcs).length > 0) {
    writeFileSync(emulatorSettingsDlc, dlcsToMustacheTemplate(dataGameDlcs));
  }

  execFile(emulatorLoaderPath);

  showToast(event, `Launch ${dataGamePath}`, 'success');
};

export default gameLauncher;
