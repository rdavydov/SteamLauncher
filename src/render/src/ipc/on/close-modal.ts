import closeModal from '../../functions/close-modal.js';

window.api.on('close-modal', () => {
  closeModal(true);
});
