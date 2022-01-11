import $ from 'jquery';
import settingsSetNetwork from './functions/settings-set-network.js';
import showToast from './functions/show-toast.js';

(async () => {
  await window.api.invoke('settings-get-network').then((is) => {
    const $dom = $("button[data-sk='set-network']");
    const to = is ? 'online' : 'offline';
    settingsSetNetwork($dom, to);
  });

  window.api.on('window-when-change-state', (_event, isMaximized) => {
    $('body').toggleClass('main-titlebar-is-maximized', isMaximized);
  });

  window.api.on(
    'show-toast',
    (_event, text: string, icon: 'info' | 'warning' | 'success' | 'error' = 'info') => {
      showToast(text, icon);
    },
  );
})();
