import settingsSetNetworkStatus from '../../functions/settings-set-network-status';

(async () => {
  const networkStatus = await window.api.settings.getNetworkStatus();
  settingsSetNetworkStatus(networkStatus!);
})();
