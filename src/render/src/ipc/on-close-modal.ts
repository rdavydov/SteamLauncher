import closeModal from '../functions/close-modal.js';

window.api.on('close-modal', async () => {
  closeModal(true);
});
