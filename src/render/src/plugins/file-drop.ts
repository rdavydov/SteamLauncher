import config from '../config.js';

(($) => {
  $.fn.fileDrop = function (callback) {
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

        const dataTransfer = event.originalEvent?.dataTransfer;
        if (typeof dataTransfer !== 'undefined' && dataTransfer !== null) {
          const {files: droppedFiles, items} = dataTransfer;
          if (droppedFiles.length === 1) {
            const {kind} = items[0];
            if (kind === 'file') {
              const droppedFilePath = droppedFiles[0].path;
              const parsedFilePath = await window.api.app.filePathParse(droppedFilePath);
              if (config.allowedExtensions.includes(parsedFilePath.ext)) {
                callback.call(this, parsedFilePath);
              } else {
                $.snack("The file extension isn't allowed!", 'error');
              }
            } else {
              $.snack("The dropped item isn't a valid file!", 'error');
            }
          } else {
            $.snack("Isn't possible to add more than one file!", 'warning');
          }
        } else {
          $.snack('filedrop: unknown error', 'warning');
        }
      });
    });
  };
})(jQuery);
