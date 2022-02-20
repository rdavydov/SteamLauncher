(($) => {
  const fill = ($dom: JQuery, value: string[] | undefined) => {
    if (typeof value !== 'undefined') {
      const $inputGroup = $dom.closest('.input-group');
      const $input = $inputGroup.find('.form-control');
      $input.val(value[0]);
    }
  };

  const choseDir = async () => {
    return window.api.app.choseDirectory();
  };

  const choseFile = async () => {
    return window.api.app.choseFile();
  };

  $(document).on('click', "*[data-sk='choseDirFile']", async (event) => {
    event.preventDefault();
    const $dom = $(event.currentTarget);
    const what = $dom.attr('data-sk-what');
    let chosed: string[] | undefined;

    switch (what) {
      case 'dir': {
        chosed = await choseDir();
        break;
      }

      case 'file': {
        chosed = await choseFile();
        break;
      }

      default: {
        chosed = await choseDir();
        break;
      }
    }

    fill($dom, chosed);
  });
})(jQuery);

export {};
