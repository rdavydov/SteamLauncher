$(document).on('click', "button[data-sk='titlebar']", async (event) => {
  event.preventDefault();
  const attribute = $(event.currentTarget).attr('data-sk-attr')!;
  switch (attribute) {
    case 'minimize':
      await window.api.window.minimize();
      break;
    case 'maximize':
      await window.api.window.maximize();
      break;
    case 'restore':
      await window.api.window.restore();
      break;
    case 'close':
      await window.api.window.close();
      break;
    default:
      break;
  }
});

export {};
