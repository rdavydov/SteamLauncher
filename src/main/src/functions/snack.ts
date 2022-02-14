import {webContents} from 'electron';
// Import log from 'electron-log';

const snack = (text: string, type: SnackTypeArg = 'info') => {
  // TODO: test
  // log.info(text);
  webContents.getFocusedWebContents().send('snack', text, type);
};

export default snack;
