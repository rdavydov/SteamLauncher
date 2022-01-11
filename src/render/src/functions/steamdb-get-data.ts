import $ from 'jquery';

const steamDbGetData = async (appId: string) => {
  const doc = (await window.api.invoke('steamdb-get-data', appId)) as string;

  const $dom = $($.parseHTML(doc));
  const dlcs: Record<string, string> = {};
  $dom.find('#dlc.tab-pane tr.app[data-appid]').each((_index, element) => {
    const $elm = $(element);
    const appId = $elm.attr('data-appid');
    const appName = $elm.find('td:nth-of-type(2)').text().trim();
    if (typeof appId !== 'undefined' && typeof appName !== 'undefined') {
      dlcs[appId] = appName;
    }
  });

  return {
    name: $dom.find('h1[itemprop="name"]').text().trim(),
    headerImageUrl: $dom.find('img.app-logo').attr('src')!,
    isGame: $dom.find('td[itemprop="applicationCategory"]').text().toLowerCase() === 'game',
    dlcs,
  };
};

export default steamDbGetData;
