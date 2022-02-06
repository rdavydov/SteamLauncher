$(document).on('click', "button[data-sk='titlebar']", async (event) => {
  event.preventDefault();
  const attribute = $(event.currentTarget).data('sk-attr') as string;
  switch (attribute) {
    case 'minimize':
      await window.api.invoke('window-minimize');
      break;
    case 'maximize':
      await window.api.invoke('window-maximize');
      break;
    case 'restore':
      await window.api.invoke('window-restore');
      break;
    case 'close':
      await window.api.invoke('window-close');
      break;
    default:
      break;
  }
});

export {};
