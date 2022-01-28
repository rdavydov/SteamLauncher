import type Navigo from 'navigo';
import mustache from 'mustache';
import $ from 'jquery';
import {encodeUriObject} from '../../../functions/encoded-decode-uri-object.js';

class IndexView {
  private $dom: JQuery | undefined;
  private readonly router;

  public constructor(router: Navigo) {
    this.router = router;
  }

  public async show() {
    await this.setDom();
    await this.appendTemplate();
    await this.appendGamesList();
    await this.setEvents();
  }

  private async appendGamesList() {
    const gamesData = (await window.api.invoke('games-data')) as Record<
      string,
      Record<string, string>
    >;
    const $gamesList = this.$dom?.find('#gamesList');
    if (gamesData !== null && Object.keys(gamesData).length > 0) {
      $gamesList?.empty();
      $("<div class='games-grid'></div>").appendTo($gamesList!);
      $.each(gamesData, (appId: string, values) => {
        const headerImage = values.headerImage;
        const name = values.name;
        $(`<div class="game-container" data-appId="${appId}">`)
          .html(`<img src="${headerImage}"/><div>${name}</div>`)
          .appendTo($gamesList!.find('> div'));
      });
    } else {
      $gamesList?.html(
        `<h1 class="flex flex-auto justify-center">You haven't entered any games yet!</h1>`,
      );
    }
  }

  private async appendTemplate() {
    const $container = $('.main-container');
    $container.empty();
    this.$dom?.appendTo($container);
  }

  private async setEvents() {
    this.$dom?.on('contextmenu', '.game-container', (event) => {
      const appId = $(event.currentTarget).attr('data-appId');
      window.api.send('game-contextmenu-show', appId);
    });

    window.api.on('game-contextmenu-redirect', (_event, to: string) => {
      this.router.navigate(to);
    });

    window.api.on('index-view-reload-games', async () => {
      await this.appendGamesList();
    });

    $('#file-drop').fileDrop((file) => {
      const urlSearchParameters = new URLSearchParams(encodeUriObject(file)).toString();
      this.router.navigate(`/game/add/?${urlSearchParameters}`);
    });
  }

  private async setDom() {
    const {default: html} = await import('./main.html?raw');
    const dom = mustache.render(html, {});
    this.$dom = $(dom);
  }
}

export default IndexView;
