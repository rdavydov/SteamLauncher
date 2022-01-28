import $ from 'jquery';
import settingsSetNetwork from '../functions/settings-set-network.js';

(async () => {
  const $dom = $("button[data-sk='set-network']");
  const status = (await window.api.invoke('settings-get-network')) as boolean;
  const to = status ? 'online' : 'offline';
  settingsSetNetwork($dom, to);
})();
