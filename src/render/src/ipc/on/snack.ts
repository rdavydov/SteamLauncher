window.api.on('snack', (_event, content: string, type: SnackTypeArg = 'info') => {
  $.snack(content, type);
});

export {};
