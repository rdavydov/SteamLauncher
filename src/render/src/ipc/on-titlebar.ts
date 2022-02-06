window.api.on('window-when-change-state', (_event, isMaximized: boolean) => {
  $(document.body).toggleClass('window-is-maximized', isMaximized);
});

export {};
