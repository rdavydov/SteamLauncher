import settingsSetNetworkStatus from '../../functions/settings-set-network-status.js';

(async () => {
  const networkStatus = await window.api.settings.getNetworkStatus();
  settingsSetNetworkStatus(networkStatus!);
})();
