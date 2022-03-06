import navigo from '../navigo';

$(document).on('hidden.bs.modal', '.modal', () => {
  const dom = $('.modal');
  dom.modal('dispose');
  dom.remove();
  navigo.navigate('/');
});
