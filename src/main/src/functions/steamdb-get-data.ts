import {BrowserWindow} from 'electron';

const worldId = 999;

const steamDbGetData = async (appId: string): Promise<string | undefined> => {
  const win = new BrowserWindow({
    show: false,
  });

  win.removeMenu();
  await win.loadURL(`https://steamdb.info/app/${appId}/`);

  const html = (await win.webContents.executeJavaScriptInIsolatedWorld(worldId, [
    {
      code: `document.querySelector("body").innerHTML`,
    },
  ])) as string;

  if (html.includes('cf-browser-verification')) {
    win.show();
    await win.webContents.executeJavaScriptInIsolatedWorld(worldId, [
      {
        code: `window.alert("The first time wait for the page to load until the application is displayed, close the page and try saving again! Please click ok to confirm.")`,
      },
    ]);
    return undefined;
  }

  win.close();
  return html;
};

export default steamDbGetData;
