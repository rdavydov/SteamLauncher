import {productName} from '../../../../package.json';

(($) => {
  const toastContainer = `<div aria-live="polite" aria-atomic="true" class="position-relative"><div class="toast-container absolute bottom-0 right-0 m-3"></div>
  </div>`;

  $(document).on('hidden.bs.toast', '.toast', function () {
    $(this).toast('dispose');
    $(this).remove();
  });

  $.snack = (
    content: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    delay = 2000,
  ) => {
    if ($('.toast-container').length === 0) {
      $(toastContainer).appendTo('body');
    }

    const container = $('.toast-container');
    const icons = {
      info: 'alert-circle',
      success: 'check-circle',
      warning: 'alert-decagram',
      error: 'alert',
    };

    if (container.find('> .toast').length > 3) {
      container.find('> .toast:first-child').toast('hide');
    }

    const html =
      $(`<div class="toast toast-${type}" data-bs-delay="${delay}" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <div class="toast-header-left">
      <span class="mdi mdi-${(icons as Record<string, string>)[type]}"></span>
      <span>${productName}</span>
    </div>
    <div class="toast-header-right">
      <button type="button" data-bs-dismiss="toast">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
  </div>
  <div class="toast-body">${content}</div>
</div>`);

    html.appendTo(container);
    html.toast('show');
  };
})(jQuery);
