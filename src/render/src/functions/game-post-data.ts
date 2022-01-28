import serializeObject from './serialize-object.js';
import showToast from './show-toast.js';
import steamDbGetData from './steamdb-get-data.js';

const nowTimeBySeconds = () => Math.floor(Date.now() / 1000);

const gamePostData = async (
  $dom: JQuery<Element>,
  channel: string,
  oldAppId: string | undefined = undefined,
) => {
  const isEditChannel = channel === 'game-edit';
  const serialize = serializeObject($dom);
  const appId = serialize.appId as string;
  const getAppId = oldAppId === appId ? oldAppId : appId;
  let steamDbParsedData: Record<string, unknown> = {};

  if (isEditChannel) {
    const gameData = (await window.api.invoke('game-data', oldAppId)) as Record<string, unknown>;
    const lastRequest = gameData.lastRequest as number;
    // NOTE: oldAppId !== appId for new request if edited appId
    const check = nowTimeBySeconds() - lastRequest > 0 || oldAppId !== appId;
    if (check) {
      steamDbParsedData = await steamDbGetData(getAppId);
      showToast('Updated game based on steamdb!');
    } else {
      steamDbParsedData = {
        name: gameData.name,
        headerImageUrl: gameData.headerImageUrl,
        isGame: gameData.isGame,
        dlcs: gameData.dlcs,
        lastRequest: gameData.lastRequest,
      };
      showToast(
        'Minuti rimanenti per aggiornare i dati di gioco ' +
          Math.floor(Math.abs(nowTimeBySeconds() - lastRequest - 3600) / 60).toString(),
      );
    }
  } else {
    steamDbParsedData = await steamDbGetData(appId);
  }

  if (!steamDbParsedData.isGame) {
    showToast("Isn't a game!");
    return;
  }

  const newSerialize = Object.assign({}, serialize, steamDbParsedData);

  if (isEditChannel) {
    window.api.send(channel, newSerialize, oldAppId);
  } else {
    window.api.send(channel, newSerialize);
  }
};

export default gamePostData;
