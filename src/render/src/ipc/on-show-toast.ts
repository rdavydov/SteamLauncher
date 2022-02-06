window.api.on(
  'show-toast',
  (_event, content: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    $.snack(content, type);
  },
);

export {};
