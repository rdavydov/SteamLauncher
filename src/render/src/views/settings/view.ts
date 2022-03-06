import mustache from 'mustache';

class SettingsView {
  private dom: JQuery | undefined;

  private data: StoreSettingsType | undefined;

  public async show () {
    await this.setData();
    await this.setDom();
    await this.appendDom();
  }

  private async setData () {
    this.data = await window.api.settings.getData();
  }

  private async setDom () {
    const {
      default: html,
    } = await import('./settings.html?raw');
    const rendered = mustache.render(html, {
      data: this.data,
    });
    this.dom = $(rendered);
  }

  private async appendDom () {
    this.dom?.appendTo(document.body).modal('show');
  }
}

export default SettingsView;
