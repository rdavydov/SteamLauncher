import {
  Notification,
} from 'electron';
import log from 'electron-log';

const notify = (message: string) => {
  if (Notification.isSupported()) {
    const nn = new Notification({
      body: message,
    });
    nn.show();
  } else {
    log.debug('Notifications system isn\'t supported!');
  }
};

export default notify;
