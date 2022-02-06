(async () => {
  const appName = (await window.api.invoke('app-get-name')) as string;
  $('.navbar-brand span, title').text(appName);
})();

export {};
