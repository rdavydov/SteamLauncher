import navigo from '../navigo.js';

const _closeModal = ($elm: JQuery) => {
  $elm.modal('dispose');
  $elm.remove();

  navigo.navigate('/');
};

const closeModal = (onHide = false, selector = '.modal') => {
  const $elm = $(selector);

  if (onHide) {
    $elm.modal('hide');
    $elm.on('hidden.bs.modal', () => {
      _closeModal($elm);
    });
  } else {
    _closeModal($elm);
  }
};

export default closeModal;
