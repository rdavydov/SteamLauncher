import jQuery from 'jquery';
import config from '../config.js';
import showToast from '../functions/show-toast.js';

(($) => {
  $.fn.fileDrop = function (callback: (file: Record<string, string>) => void) {
    const activeClass = 'drop-highlight';

    return this.each(() => {
      const $dom = $(this);
      $dom.on('dragenter dragend dragleave dragover drag', (event) => {
        event.preventDefault();
      });

      $dom.on('dragover', () => {
        if (!$dom.hasClass(activeClass)) {
          $dom.addClass(activeClass);
        }
      });

      $dom.on('dragleave', () => {
        if ($dom.hasClass(activeClass)) {
          $dom.removeClass(activeClass);
        }
      });

      $dom.on('drop', async (event) => {
        $dom.trigger('dragleave');
        const {originalEvent} = event;
        if (typeof originalEvent !== 'undefined') {
          const {dataTransfer} = originalEvent;
          if (dataTransfer) {
            const {files} = dataTransfer;
            if (files.length === 1) {
              const {items} = dataTransfer;
              const {kind} = items[0];
              if (kind === 'file') {
                const filePath = files[0].path;
                const file = (await window.api.invoke(
                  'app-file-path-parse',
                  files[0].path,
                )) as Record<string, string>;
                file.path = filePath;

                // eslint-disable-next-line max-depth
                if (config.allowedExtensions.includes(file.ext)) {
                  callback.call(this, file);
                } else {
                  showToast('The file extension is not allowed!', 'error');
                }
              } else {
                showToast('The dropped item is not a file! ');
              }
            } else {
              showToast('It is not possible to add more than one file! ', 'warning');
            }
          }
        }
      });
    });
  };
})(jQuery);
