import $ from 'jquery';

window.api.on('window-when-change-state', (_event, isMaximized: boolean) => {
  $('body').toggleClass('main-titlebar-is-maximized', isMaximized);
});
