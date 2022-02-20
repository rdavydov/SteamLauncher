import {app} from 'electron';
import {join} from 'node:path';

const generateAppIdPaths = (appId: string, language: string) => {
  const userData = app.getPath('userData');

  const dataPath = join(userData, 'data');
  const appsPath = join(dataPath, 'apps');

  const appIdDataPath = join(appsPath, appId);
  const appIdAchievementsInfoPath = join(appIdDataPath, 'achievements.json');
  const appIdAchievementsPath = join(appIdDataPath, 'achievements');
  const appIdStatsInfoPath = join(appIdDataPath, 'stats.txt');
  const appIdItemsInfoPath = join(appIdDataPath, 'items.json');
  const appIdDlcsInfoPath = join(appIdDataPath, 'DLC.txt');
  const appIdSteamInterfacesPath = join(appIdDataPath, 'steam_interfaces.txt');

  const steamRetrieverPath = join(dataPath, 'steam_retriever');
  const steamRetrieverAppIdPath = join(steamRetrieverPath, appId);
  const steamRetrieverAppIdInfoPath = join(steamRetrieverAppIdPath, appId + '.json');
  const steamRetrieverBackgroundPath = join(steamRetrieverAppIdPath, 'background.jpg');
  const steamRetrieverStatsPath = join(steamRetrieverAppIdPath, 'stats.json');
  const steamRetrieverItemsPath = join(steamRetrieverAppIdPath, 'db_inventory.json');

  const steamRetrieverAchievementsImagesPath = join(steamRetrieverAppIdPath, 'achievements_images');
  const steamRetrieverAchievementsInfoPath = join(
    steamRetrieverAppIdPath,
    language + '.db_achievements.json',
  );
  const steamRetrieverAchievementsInfoDefaultPath = join(
    steamRetrieverAppIdPath,
    'english.db_achievements.json',
  );

  return {
    dataPath,
    appsPath,
    appIdDataPath,
    appIdAchievementsInfoPath,
    appIdAchievementsPath,
    appIdStatsInfoPath,
    appIdItemsInfoPath,
    appIdDlcsInfoPath,
    appIdSteamInterfacesPath,
    steamRetrieverPath,
    steamRetrieverAppIdPath,
    steamRetrieverAppIdInfoPath,
    steamRetrieverBackgroundPath,
    steamRetrieverStatsPath,
    steamRetrieverItemsPath,
    steamRetrieverAchievementsImagesPath,
    steamRetrieverAchievementsInfoPath,
    steamRetrieverAchievementsInfoDefaultPath,
  };
};

export default generateAppIdPaths;
