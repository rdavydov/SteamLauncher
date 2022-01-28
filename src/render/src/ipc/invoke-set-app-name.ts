import $ from 'jquery';

(async () => {
  const appName = (await window.api.invoke('app-get-name')) as string;
  $('.main-titlebar-header > span, title').text(appName);
})();
