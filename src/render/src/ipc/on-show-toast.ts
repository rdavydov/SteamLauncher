import showToast from '../functions/show-toast.js';

window.api.on(
  'show-toast',
  (_event, text: string, icon: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    showToast(text, icon);
  },
);
