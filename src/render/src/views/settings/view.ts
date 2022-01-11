import type Navigo from 'navigo';
import $ from 'jquery';
import mustache from 'mustache';
import serializeObject from '../../functions/serialize-object.js';

class SettingsView {
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

  private async appendDom() {
    this.$dom?.appendTo(document.body);
  }

  private async setEvents() {
    window.api.on('settings-view-close-modal', async () => {
      await this.closeModal();
    });

    this.$dom?.on('click', 'button[data-sk="modal"][data-sk-attr="close"]', async (event) => {
      event.preventDefault();
      await this.closeModal();
    });

    this.$dom?.on('submit', 'form', (event) => {
      event.preventDefault();
      const $dom = $(event.currentTarget);
      const serialize = serializeObject($dom);
      window.api.send('settings-edit', serialize);
    });
  }

  private async setDom() {
    const settingsData = (await window.api.invoke('settings-data')) as Record<string, unknown>;
    const {default: html} = await import('./main.html?raw');
    const dom = mustache.render(html, {
      settingsData,
    });
    this.$dom = $(dom);
  }

  private async closeModal() {
    this.$dom?.remove();
    this.router.navigate('/');
  }
}

export default SettingsView;
