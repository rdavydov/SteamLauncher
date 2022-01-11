import Navigo from 'navigo';
import $ from 'jquery';
import IndexView from './views/index/view.js';
import AboutView from './views/about/view.js';
import AccountEditView from './views/account-edit/view.js';
import AccountCreateView from './views/account-create/view.js';
import SettingsView from './views/settings/view.js';
import GameAddView from './views/game-add/view.js';
import GameEditView from './views/game-edit/view.js';

const router = new Navigo('/', {hash: true});

const indexController = new IndexView(router);
const aboutController = new AboutView(router);
const accountEditController = new AccountEditView(router);
const accountCreateController = new AccountCreateView(router);
const settingsController = new SettingsView(router);
const gameAddController = new GameAddView(router);
const gameEditController = new GameEditView(router);

router.hooks({
  after: (match) => {
    const matchedPath = `/${match.url}`;
    const aSelector = 'a[data-navigo]';
    $(aSelector).removeClass('border-b');
    $(`${aSelector}[href='${matchedPath}']`).addClass('border-b');
  },
});

router.on(
  async () => {
    await indexController.show();
  },
  {
    before: async (done) => {
      const accountExist = (await window.api.invoke('account-exist')) as boolean;
      if (!accountExist) {
        router.navigate('/account/create');
      }

      done();
    },
  },
);

router.on('/about', async () => {
  await aboutController.show();
});

router.on('/account/create', async () => {
  await accountCreateController.show();
});

router.on('/account/edit', async () => {
  await accountEditController.show();
});

router.on('/settings', async () => {
  await settingsController.show();
});

router.on('/game/add', async (match) => {
  await gameAddController.setMatch(match);
  await gameAddController.show();
});

router.on('/game/edit/:appId', async (match) => {
  await gameEditController.setMatch(match);
  await gameEditController.show();
});

router.resolve();
