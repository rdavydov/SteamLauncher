import $ from 'jquery';
import settingsSetNetwork from '../functions/settings-set-network.js';

$("button[data-sk='set-network']").on('click', (event) => {
  event.preventDefault();
  const $dom = $(event.currentTarget);
  const to = $dom.attr('data-sk-to');
  settingsSetNetwork($dom, to!, true);
});
