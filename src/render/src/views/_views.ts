import navigo from '../navigo';
import AboutView from './about/view';
import AccountView from './account/view';
import GameView from './game/view';
import HomeView from './home/view';
import SettingsView from './settings/view';

const homeController = new HomeView();
(async () => {
  await homeController.show();
})();

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
