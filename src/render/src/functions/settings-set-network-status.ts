const settingsSetNetworkStatus = (to: string | boolean, updateStatus = false) => {
  const $dom = $("button[data-sk='set-network']");
  const _to = typeof to === 'string' ? to === 'online' : to;
  if (_to) {
    $dom.attr({
      'data-sk-to': 'offline',
      title: 'Go offline',
    });
  } else {
    $dom.attr({
      'data-sk-to': 'online',
      title: 'Go online',
    });
  }

  if (updateStatus) {
    if (_to) {
      $.snack('You are online!', 'success');
    } else {
      $.snack('You are offline!', 'warning');
    }

    window.api.settings.setNetworkStatus(_to);
  }
};

export default settingsSetNetworkStatus;
