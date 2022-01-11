import type {IpcMainEvent, IpcMainInvokeEvent} from 'electron';
import gameRemove from './game-remove.js';
import showToast from './show-toast.js';
import storage from './storage.js';

const gameRemoveHandle = (
  event: IpcMainEvent | IpcMainInvokeEvent,
  appId: string,
  showMessage = true,
) => {
  const removed = gameRemove(appId);
  if (removed !== null) {
    storage.set(`games`, removed);
    if (showMessage) {
      showToast(event, 'Game removed successfully!', 'success');
    }

    event.sender.send('index-view-reload-games');
    return;
  }

  if (showMessage) {
    showToast(event, 'Error when try to remove game', 'success');
  }
};

export default gameRemoveHandle;
