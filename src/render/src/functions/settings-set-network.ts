const settingsSetNetwork = (to: string | boolean, send = false) => {
  const $dom = $("button[data-sk='set-network']");
  const _to = typeof to === 'boolean' ? (to ? 'online' : 'offline') : to;
  if (_to === 'online') {
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

  if (send) {
    window.api.send('settings-set-network', to !== 'offline');
  }
};

export default settingsSetNetwork;
