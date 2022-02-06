import settingsSetNetwork from '../functions/settings-set-network.js';

(async () => {
  const networkStatus = (await window.api.invoke('settings-get-network')) as boolean;
  settingsSetNetwork(networkStatus);
})();
