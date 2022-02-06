import mustache from 'mustache';
import {allowedLanguages} from '../../config.js';
import objs2list from '../../functions/objs2list.js';

class AccountCreateView {
  private $dom = $();
  private accountData: Record<string, string> | undefined;
  private isEditMode = false;

  public async show(editMode = false) {
    this.isEditMode = editMode;

    if (this.isEditMode) {
      await this.setData();
    }

    await this.setDom();
    await this.afterSetDom();
    await this.appendDom();
  }

  private async setData() {
    this.accountData = (await window.api.storage.get('account')) as
      | Record<string, string>
      | undefined;
  }

  private async setDom() {
    const {default: html} = await import('./account.html?raw');
    const view = {
      isEditMode: this.isEditMode,
      inputLanguages: objs2list(allowedLanguages),
    };
    if (this.isEditMode) {
      Object.assign(view, {accountData: this.accountData});
    } else {
      const inputSteamId = (await window.api.invoke('account-get-random-steamid')) as string;
      Object.assign(view, {inputSteamId});
    }

    const dom = mustache.render(html, view);
    this.$dom = $(dom);
  }

  private async afterSetDom() {
    if (this.isEditMode) {
      this.$dom.find('select[name="language"]').val(this.accountData!.language);
    }
  }

  private async appendDom() {
    if (!this.isEditMode) {
      this.$dom.attr({
        'data-bs-backdrop': 'static',
        'data-bs-keyboard': 'false',
      });
    }

    this.$dom.appendTo(document.body).modal('show');
  }
}

export default AccountCreateView;
