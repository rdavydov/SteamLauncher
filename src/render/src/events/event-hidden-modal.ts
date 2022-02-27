import navigo from '../navigo.js';

$(document).on('hidden.bs.modal', '.modal', () => {
  const $dom = $('.modal');
  $dom.modal('dispose');
  $dom.remove();
  navigo.navigate('/');
});
