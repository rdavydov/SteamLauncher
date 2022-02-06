import navigo from '../navigo.js';
import IndexView from './index/view.js';
import GameView from './game/view.js';
import AboutView from './about/view.js';
import SettingsView from './settings/view.js';
import AccountView from './account/view.js';

const indexController = new IndexView();
navigo.on(
  async () => {
    await indexController.show();
  },
  {
    before: async (done) => {
      const accountExist = (await window.api.invoke('account-exist')) as boolean;
      if (!accountExist) {
        navigo.navigate('/account/create');
      }

      done();
    },
  },
);

const aboutController = new AboutView();
navigo.on('/about', async () => {
  await aboutController.show();
});

const accountController = new AccountView();
navigo.on('/account/create', async () => {
  await accountController.show();
});

navigo.on('/account/edit', async () => {
  await accountController.show(true);
});

const settingsController = new SettingsView();
navigo.on('/settings', async () => {
  await settingsController.show();
});

const gameController = new GameView();
navigo.on('/game/add', async () => {
  await gameController.show();
});

navigo.on('/game/edit/:appId', async () => {
  await gameController.show(true);
});

navigo.resolve();
