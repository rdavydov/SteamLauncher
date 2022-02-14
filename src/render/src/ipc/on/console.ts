import closeModal from '../../functions/close-modal.js';

const addToConsole = (txt: string) => {
  const a = $('#console .modal-body');
  $('<p>').text(txt).appendTo(a);
  a.scrollTop(a.prop('scrollHeight') - a.height()!);
};

window.api.on('show-console', async () => {
  const {default: html} = await import('./console.html?raw');
  $(html).appendTo('body').modal('show');
});

window.api.on('hide-console', (_event, timeout = 0) => {
  let i = 0;
  const interval = window.setInterval(() => {
    if (i === timeout) {
      closeModal(true);
      window.clearInterval(interval);
    } else {
      addToConsole(`close in ${timeout - i}...`);
      i++;
    }
  }, 1000);
});

window.api.on('add-to-console', (_event, txt: string) => {
  addToConsole(txt);
});
