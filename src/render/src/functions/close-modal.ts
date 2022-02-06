import navigo from '../navigo.js';

const _closeModal = ($elm: JQuery) => {
  $elm.modal('dispose');
  $elm.remove();

  navigo.navigate('/');
};

const closeModal = (onHide = false) => {
  const $elm = $('.modal');

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
