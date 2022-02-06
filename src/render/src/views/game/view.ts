import mustache from 'mustache';
import navigo from '../../navigo.js';
import objs2list from '../../functions/objs2list.js';

class GameAddView {
  private $dom = $();
  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    await this.appendDom();
  }

  private async appendDom() {
    this.$dom.appendTo(document.body).modal('show');
  }

  private async setDom() {
    const {default: html} = await import('./game.html?raw');

    let view = {};
    const currentLocationInfo = navigo.current![0];

    if (this.isEditMode) {
      const appId = currentLocationInfo.data?.appId;
      const gameData = (await window.api.invoke('game-data', appId)) as Record<
        string,
        Record<string, string>
      >;
      view = {
        isEditMode: this.isEditMode,
        gameData,
        gameDataAppId: appId,
        gameDataDlcs: objs2list(gameData.dlcs),
      };
    } else {
      const parameters = currentLocationInfo.params;
      view = {
        parameters,
      };
    }

    const dom = mustache.render(html, view);
    this.$dom = $(dom);
  }
}

export default GameAddView;
