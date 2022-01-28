import type Navigo from 'navigo';
import type {Match} from 'navigo';
import $ from 'jquery';
import mustache from 'mustache';
import gamePostData from '../../../functions/game-post-data.js';
import dlcsToMustacheTemplate from '../../../functions/dlcs-to-mustache-template.js';

class GameEditView {
  public match: Match | undefined;
  private $dom: JQuery | undefined;
  private readonly router;

  public constructor(router: Navigo) {
    this.router = router;
  }

  public async show() {
    await this.setDom();
    await this.appendDom();
    await this.setEvents();
  }

  public async setMatch(match: Match | undefined) {
    this.match = match;
  }

  private async appendDom() {
    this.$dom?.appendTo(document.body);
  }

  private async setEvents() {
    window.api.on('game-view-close-modal', async () => {
      await this.closeModal();
    });

    this.$dom?.on('click', 'button[data-sk="modal"][data-sk-attr="close"]', async (event) => {
      event.preventDefault();
      await this.closeModal();
    });

    this.$dom?.find('form').on('submit', async (event) => {
      event.preventDefault();
      const $dom = $(event.currentTarget);
      await gamePostData($dom, 'game-edit', this.match!.data!.appId);
    });
  }

  private async closeModal() {
    this.$dom?.remove();
    this.router.navigate('/');
  }

  private async setDom() {
    const appId = this.match!.data!.appId;
    const {default: html} = await import('./main.html?raw');
    const gameData = (await window.api.invoke('game-data', appId)) as Record<
      string,
      Record<string, string>
    >;
    const dom = mustache.render(html, {
      appId,
      gameData,
      dlcs: dlcsToMustacheTemplate(gameData.dlcs),
    });
    this.$dom = $(dom);
  }
}

export default GameEditView;
