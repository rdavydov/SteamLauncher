import serializeForm from '../functions/serialize-form';

$(document).on('submit', '.modal form[data-sk-channel]', (event) => {
  event.preventDefault();
  const dom = $(event.currentTarget);
  const channel = dom.attr('data-sk-channel')!;
  const serialized = serializeForm(dom[0]);
  window.api.send(channel, serialized);
});
