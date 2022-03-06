type SteamRetrieverAchievement = {
  defaultvalue: number,
  description: string,
  displayName: string,
  hidden: number,
  icon: string,
  icongray: string,
  name: string,
};

type SteamRetrieverAchievements = Record<string, SteamRetrieverAchievement>;

type SteamRetrieverStat = {
  defaultvalue: number,
  displayName: string,
  name: string,
};

type SteamRetrieverStats = Record<string, SteamRetrieverStat>;

// INCLUDE ONLY USED KEY
type SteamRetrieverItem = {
  appid: string,
};

type SteamRetrieverItems = Record<string, SteamRetrieverItem>;

type SteamRetrieverAppIdPlatforms = {
  linux: boolean,
  mac: boolean,
  windows: boolean,
};

type SteamRetrieverAppIdDlcs = {
  ImageUrl: string,
  Name: string,
  Type: string,
};

type SteamRetrieverAppId = {
  AppId: string,
  Dlcs: Record<string, SteamRetrieverAppIdDlcs>,
  ImageUrl: string,
  Languages: string[],
  Name: string,
  Platforms: SteamRetrieverAppIdPlatforms,
  Type?: string,
};
