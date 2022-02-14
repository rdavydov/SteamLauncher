import mustache from 'mustache';
import navigo from '../../navigo.js';
import iteratorToObject from '../../functions/iterator-to-object.js';

class GameAddView {
  private $dom: JQuery | undefined;
  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    await this.setDom();
    await this.appendDom();
  }

  private async appendDom() {
    this.$dom?.appendTo(document.body).modal('show');
  }

  private async setDom() {
    const {default: html} = await import('./game.html?raw');

    let view = {};
    const current = navigo.current![0];
    const appId = current.data?.appId;
    const queryString = current.queryString;

    if (this.isEditMode) {
      const gameData = await window.api.game.getData(appId!);
      view = {
        isEditMode: this.isEditMode,
        gameData,
      };
    } else {
      const parameters = new URLSearchParams(queryString);
      view = {
        parameters: iteratorToObject(parameters),
      };
    }

    const rendered = mustache.render(html, view);
    this.$dom = $(rendered);
  }
}

export default GameAddView;
