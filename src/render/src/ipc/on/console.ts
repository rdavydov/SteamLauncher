const addToConsole = (txt: string) => {
  const a = $('#console .modal-body');
  $('<p>').text(txt).appendTo(a);
  a.scrollTop(a.prop('scrollHeight') - a.height()!);
};

window.api.on('show-console', async () => {
  const {default: html} = await import('./console.html?raw');
  $(html).appendTo('body').modal('show');
});

window.api.on('hide-console', (_event) => {
  window.setTimeout(() => {
    $('#console').addClass('finished');
    addToConsole('');
    addToConsole('');
    addToConsole('Press Enter to exit...');
  }, 1500);
});

window.api.on('add-to-console', (_event, txt: string) => {
  addToConsole(txt);
});

$(window).on('keyup', (event) => {
  const $console = $('#console');
  if (event.key === 'Enter' && $console.hasClass('finished')) {
    $console.removeClass('finished');
    $('.modal').modal('hide');
  }
});

export {};
