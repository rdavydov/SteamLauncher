const settingsSetNetworkStatus = (to: boolean | string, updateStatus = false) => {
  const dom = $('button[data-sk="set-network"]');
  const too = typeof to === 'string' ? to === 'online' : to;
  if (too) {
    dom.attr({
      'data-sk-to': 'offline',
      title: 'Go offline',
    });
  } else {
    dom.attr({
      'data-sk-to': 'online',
      title: 'Go online',
    });
  }

  if (updateStatus) {
    if (too) {
      window.api.app.notify('You are online!');
    } else {
      window.api.app.notify('You are offline!');
    }

    window.api.settings.setNetworkStatus(too);
  }
};

export default settingsSetNetworkStatus;
