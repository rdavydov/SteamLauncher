type SteamRetrieverAchievement = {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  description: string;
  icon: string;
  icongray: string;
};

type SteamRetrieverAchievements = Record<string, SteamRetrieverAchievement>;

type SteamRetrieverStat = {
  name: string;
  defaultvalue: number;
  displayName: string;
};

type SteamRetrieverStats = Record<string, SteamRetrieverStat>;

// INCLUDE ONLY USED KEY
type SteamRetrieverItem = {
  appid: string;
};

type SteamRetrieverItems = Record<string, SteamRetrieverItem>;

type SteamRetrieverAppIdPlatforms = {
  windows: boolean;
  mac: boolean;
  linux: boolean;
};

type SteamRetrieverAppIdDlcs = {
  Name: string;
  ImageUrl: string;
  Type: string;
};

type SteamRetrieverAppId = {
  Dlcs: Record<string, SteamRetrieverAppIdDlcs>;
  Name: string;
  AppId: string;
  ImageUrl: string;
  Languages: string[];
  Platforms: SteamRetrieverAppIdPlatforms;
  Type?: string;
};
