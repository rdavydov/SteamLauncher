import {webContents} from 'electron';

const snack = (text: string, type: SnackTypeArg = 'info') => {
  webContents.getFocusedWebContents().send('snack', text, type);
};

export default snack;
