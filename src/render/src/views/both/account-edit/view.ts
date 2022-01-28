import type Navigo from 'navigo';
import $ from 'jquery';
import mustache from 'mustache';
import serializeObject from '../../../functions/serialize-object.js';
// Import config from '../../../config.js';

class AccountEditView {
  private $dom: JQuery | undefined;
  private accountData: Record<string, string> | undefined;
  private readonly router;

  public constructor(router: Navigo) {
    this.router = router;
  }

  public async show() {
    await this.setData();
    await this.setDom();
    await this.appendDom();
    await this.setEvents();
  }

  private async setData() {
    this.accountData = (await window.api.storage.get('account')) as
      | Record<string, string>
      | undefined;
  }

  private async appendDom() {
    this.$dom?.appendTo(document.body);
  }

  private async setEvents() {
    window.api.on('account-view-close-modal', async () => {
      await this.closeModal();
    });

    this.$dom?.on('click', 'button[data-sk="modal"][data-sk-attr="close"]', async (event) => {
      event.preventDefault();
      await this.closeModal();
    });

    this.$dom?.find('form').on('submit', (event) => {
      event.preventDefault();
      const $dom = $(event.currentTarget);
      const serialize = serializeObject($dom);
      window.api.send('account-edit', serialize);
    });
  }

  private async setDom() {
    const {default: html} = await import('./main.html?raw');
    // Const getLanguageOptions = await this.getLanguageOptions();
    const dom = mustache.render(html, {
      accountData: this.accountData,
      // InputLanguageOptions: getLanguageOptions,
    });
    this.$dom = $(dom);
  }

  /* Private async getLanguageOptions() {
    let options = '';
    const accountLanguages: Record<string, string> = config.accountLanguages;
    for (const language of Object.keys(accountLanguages)) {
      const active = this.accountData!.language === language ? ' selected' : '';
      options += `<option value="${language}"${active}>${accountLanguages[language]}</option>`;
    }

    return options;
  } */

  private async closeModal() {
    this.$dom?.remove();
    this.router.navigate('/');
  }
}

export default AccountEditView;
