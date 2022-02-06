import mustache from 'mustache';
import navigo from '../../navigo.js';
// Import {encodeUriObject} from '../../functions/encoded-decode-uri-object.js';

class IndexView {
  private $dom = $();

  public async show() {
    await this.setDom();
    await this.appendGamesList();
    await this.setEvents();
    await this.appendDom();
  }

  private async setDom() {
    const {default: html} = await import('./index.html?raw');
    const dom = mustache.render(html, {});
    this.$dom = $(dom);
  }

  private async appendGamesList() {
    const gamesData = (await window.api.invoke('games-data')) as
      | Record<string, Record<string, string>>
      | undefined;
    const $gamesList = this.$dom.find('#games-list .card-body');
    if (typeof gamesData !== 'undefined' && Object.keys(gamesData).length > 0) {
      const $gamesGrid = $("<div class='games-grid'></div>");
      $.each(gamesData, (appId: string, values) => {
        const $gameContainer = $(`<div class="game-container" data-appId="${appId}"></div>`);
        const headerImage = values.headerImage;
        const name = values.name;

        if (headerImage !== '') {
          $('<img>').attr('src', headerImage).appendTo($gameContainer);
        }

        $('<div>').text(name).appendTo($gameContainer);

        $gamesGrid.append($gameContainer);
      });
      $gamesList?.append($gamesGrid);
    } else {
      $gamesList?.html(`<h1 class="text-center">You haven't entered any games yet!</h1>`);
    }
  }

  private async setEvents() {
    this.$dom.on('contextmenu', '.game-container', (event) => {
      const appId = $(event.currentTarget).attr('data-appId');
      window.api.send('index-contextmenu-game', appId);
    });

    this.$dom.find('#file-drop').fileDrop((file) => {
      const queryString = new URLSearchParams(file).toString();
      navigo.navigate(`/game/add/?${queryString}`);
    });

    window.api.on('index-contextmenu-redirect', (_event, to: string) => {
      navigo.navigate(to);
    });

    window.api.on('index-view-reload-games', async () => {
      navigo.navigate('/');
    });
  }

  private async appendDom() {
    $('#container').html(this.$dom[0]);
  }
}

export default IndexView;
