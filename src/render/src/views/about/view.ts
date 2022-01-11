import type Navigo from 'navigo';
import $ from 'jquery';
import mustache from 'mustache';

class AboutView {
  private $dom: JQuery | undefined = undefined;
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
    this.$dom?.on('click', 'button[data-sk="modal"][data-sk-attr="close"]', (event) => {
      event.preventDefault();
      this.$dom?.remove();
      this.router.navigate('/');
    });
  }

  private async setDom() {
    const name = (await window.api.invoke('app-get-name')) as string;
    const version = (await window.api.invoke('app-get-version')) as string;
    const description = (await window.api.invoke('app-get-description')) as string;
    const copyright = (await window.api.invoke('app-get-copyright')) as string;
    const {default: html} = await import('./main.html?raw');
    const dom = mustache.render(html, {name, version, description, copyright});
    this.$dom = $(dom);
  }
}

export default AboutView;
