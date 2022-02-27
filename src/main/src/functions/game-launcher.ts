import {join} from 'node:path';
import {existsSync, writeFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import ini from 'ini';
import {emptyDirSync, copySync} from 'fs-extra';
import storage from '../storage.js';
import snack from './snack.js';
import generateAppIdPaths from './generate-appid-paths.js';

const gameLauncher = (dataGame: StoreGameDataType, normally = false) => {
  const dataAccount = storage.get('account')!;
  const dataSettings = storage.get('settings');

  const paths = generateAppIdPaths(dataGame.appId, dataAccount.language);

  const dataGamePath = dataGame.path;
  const dataGameRunPath = dataGame.runPath;
  const dataGameCommandLine = dataGame.commandLine;

  if (normally) {
    execFile(dataGamePath, dataGameCommandLine.split(' '));
    snack(`Launch normally ${dataGame.name}`, 'success');
    return;
  }

  const emulatorPath = dataSettings.steamClientPath!;
  const emulatorLoaderPath = join(emulatorPath, 'steamclient_loader.exe');

  if (!existsSync(emulatorLoaderPath)) {
    snack(`Assign the correct folder of the experimental client in the settings!`, 'error');
    return;
  }

  const emulatorSteamSettingsPath = join(emulatorPath, 'steam_settings');

  if (existsSync(emulatorSteamSettingsPath)) {
    emptyDirSync(emulatorSteamSettingsPath);
  }

  copySync(paths.appIdDataPath, emulatorSteamSettingsPath);

  const emulatorSettingsForceAccountName = join(
    emulatorSteamSettingsPath,
    'force_account_name.txt',
  );
  const emulatorSettingsForceLanguage = join(emulatorSteamSettingsPath, 'force_language.txt');
  const emulatorSettingsForceSteamId = join(emulatorSteamSettingsPath, 'force_steamid.txt');

  writeFileSync(emulatorSettingsForceAccountName, dataAccount.name);
  writeFileSync(emulatorSettingsForceLanguage, dataAccount.language);
  writeFileSync(emulatorSettingsForceSteamId, dataAccount.steamId);

  const emulatorSettingsForceListenPort = join(emulatorSteamSettingsPath, 'force_listen_port.txt');
  const emulatorSettingsOverlay = join(emulatorSteamSettingsPath, 'disable_overlay.txt');

  writeFileSync(emulatorSettingsForceListenPort, dataGame.listenPort);

  if (!dataGame.overlay) {
    writeFileSync(emulatorSettingsOverlay, '');
  }

  const emulatorSettingsDisableNetworking = join(
    emulatorSteamSettingsPath,
    'disable_networking.txt',
  );
  const emulatorSettingsOffline = join(emulatorSteamSettingsPath, 'offline.txt');

  if (!dataSettings.network) {
    writeFileSync(emulatorSettingsDisableNetworking, '');
    writeFileSync(emulatorSettingsOffline, '');
  }

  const emulatorLoaderConfigPath = join(emulatorPath, 'ColdClientLoader.ini');

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
      AppId: dataGame.appId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      SteamClientDll: join(emulatorPath, 'steamclient.dll'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      SteamClient64Dll: join(emulatorPath, 'steamclient64.dll'),
    },
  };

  writeFileSync(emulatorLoaderConfigPath, ini.stringify(loaderConfig));

  execFile(emulatorLoaderPath);

  snack(`Launch ${dataGame.name}`, 'success');
};

export default gameLauncher;
