import $ from 'jquery';
import settingsSetNetwork from './functions/settings-set-network.js';

(async () => {
  $('.main-titlebar-header > span, title').text(await window.api.invoke('app-get-name'));

  $("button[data-sk='titlebar']").on('click', async (event) => {
    event.preventDefault();
    const attribute = $(event.currentTarget).data('sk-attr') as string;
    switch (attribute) {
      case 'minimize':
        await window.api.invoke('window-minimize');
        break;
      case 'maximize':
        await window.api.invoke('window-maximize');
        break;
      case 'restore':
        await window.api.invoke('window-restore');
        break;
      case 'close':
        await window.api.invoke('window-close');
        break;
      default:
        break;
    }
  });

  $("button[data-sk='set-network']").on('click', (event) => {
    event.preventDefault();
    const $dom = $(event.currentTarget);
    const to = $dom.attr('data-sk-to');
    settingsSetNetwork($dom, to!, true);
  });
})();
