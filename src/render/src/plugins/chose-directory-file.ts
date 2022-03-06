(($) => {
  const fill = (dom: JQuery, value: string[] | undefined) => {
    if (typeof value !== 'undefined') {
      const inputGroup = dom.closest('.input-group');
      const input = inputGroup.find('.form-control');
      input.val(value[0]);
    }
  };

  const choseDirectory = async () => {
    return await window.api.app.choseDirectory();
  };

  const choseFile = async () => {
    return await window.api.app.choseFile();
  };

  $(document).on('click', '*[data-sk="choseDirFile"]', async (event) => {
    event.preventDefault();
    const dom = $(event.currentTarget);
    const what = dom.attr('data-sk-what');
    let chosed: string[] | undefined;

    switch (what) {
      case 'dir': {
        chosed = await choseDirectory();
        break;
      }

      case 'file': {
        chosed = await choseFile();
        break;
      }

      default: {
        chosed = await choseDirectory();
        break;
      }
    }

    fill(dom, chosed);
  });
})(jQuery);

export {};
