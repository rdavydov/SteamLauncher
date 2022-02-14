import navigo from '../navigo.js';
import HomeView from './home/view.js';
import GameView from './game/view.js';
import AboutView from './about/view.js';
// Import SettingsView from './settings/view.js';
import AccountView from './account/view.js';

const homeController = new HomeView();
navigo.on(
  async () => {
    await homeController.show();
  },
  {
    before: homeController.beforeHook,
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

/* Const settingsController = new SettingsView();
navigo.on('/settings', async () => {
  await settingsController.show();
}); */

const gameController = new GameView();
navigo.on('/game/add', async () => {
  await gameController.show();
});

navigo.on('/game/edit/:appId', async () => {
  await gameController.show(true);
});

navigo.resolve();
