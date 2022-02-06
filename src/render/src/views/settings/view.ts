import mustache from 'mustache';

class SettingsView {
  private $dom = $();
  private data: Record<string, unknown> = {};

  public async show() {
    await this.setData();
    await this.setDom();
    await this.appendDom();
  }

  private async setData() {
    this.data = (await window.api.invoke('settings-data')) as Record<string, unknown>;
  }

  private async setDom() {
    const {default: html} = await import('./settings.html?raw');
    const dom = mustache.render(html, {
      data: this.data,
    });
    this.$dom = $(dom);
  }

  private async appendDom() {
    this.$dom.appendTo(document.body).modal('show');
  }
}

export default SettingsView;
