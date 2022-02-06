import closeModal from '../functions/close-modal.js';

$(document).on('hidden.bs.modal', '.modal', () => {
  closeModal();
});
