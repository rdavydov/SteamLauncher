import mustache from 'mustache';

class AboutView {
  private $dom = $();

  public async show() {
    await this.setDom();
    await this.appendDom();
  }

  private async appendDom() {
    this.$dom.appendTo(document.body).modal('show');
  }

  private async setDom() {
    const name = (await window.api.invoke('app-get-name')) as string;
    const version = (await window.api.invoke('app-get-version')) as string;
    const description = (await window.api.invoke('app-get-description')) as string;
    const copyright = (await window.api.invoke('app-get-copyright')) as string;
    const {default: html} = await import('./about.html?raw');
    const dom = mustache.render(html, {name, version, description, copyright});
    this.$dom = $(dom);
  }
}

export default AboutView;
