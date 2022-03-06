import settingsSetNetworkStatus from '../functions/settings-set-network-status';

$('button[data-sk="set-network"]').on('click', (event) => {
  event.preventDefault();
  const to = $(event.currentTarget).attr('data-sk-to')!;
  settingsSetNetworkStatus(to, true);
});
