import {serialize} from 'dom-form-serializer';
import steamDbGetData from './steamdb-get-data.js';

// TODO: unused

const nowTimeBySeconds = () => Math.floor(Date.now() / 1000);

const gamePostData = async (
  $dom: JQuery<Element>,
  channel: string,
  oldAppId: string | undefined = undefined,
) => {
  const isEditChannel = channel === 'game-edit';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const serialized = serialize($dom[0]) as Record<string, string>;
  const appId = serialized.appId;
  const getAppId = oldAppId === appId ? oldAppId : appId;
  let steamDbParsedData: Record<string, unknown> = {};

  if (isEditChannel) {
    const gameData = (await window.api.invoke('game-data', oldAppId)) as Record<string, unknown>;
    const lastRequest = gameData.lastRequest as number;
    // NOTE: oldAppId !== appId for new request if edited appId
    const check = nowTimeBySeconds() - lastRequest > 0 || oldAppId !== appId;
    if (check) {
      steamDbParsedData = await steamDbGetData(getAppId);
      $.snack('Updated game based on steamdb!');
    } else {
      steamDbParsedData = {
        name: gameData.name,
        headerImageUrl: gameData.headerImageUrl,
        isGame: gameData.isGame,
        dlcs: gameData.dlcs,
        lastRequest: gameData.lastRequest,
      };
      $.snack(
        'Minutes remaining to update game data ' +
          Math.floor(Math.abs(nowTimeBySeconds() - lastRequest - 3600) / 60).toString(),
      );
    }
  } else {
    steamDbParsedData = await steamDbGetData(appId);
  }

  if (!steamDbParsedData.isGame) {
    $.snack("Isn't a game!");
    return;
  }

  const newSerialized = Object.assign({}, serialized, steamDbParsedData);

  if (isEditChannel) {
    window.api.send(channel, newSerialized, oldAppId);
  } else {
    window.api.send(channel, newSerialized);
  }
};

export default gamePostData;
