(async () => {
  const appName = await window.api.app.getName();
  $('.navbar-brand span').text(appName); // , title
})();

export {};
