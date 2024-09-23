(function ($, Drupal) {

  /**
   * JS behaviors for footnotes.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.footnotes = {
    /**
     * Toggles a class on click.
     */
    attach: function (context) {
      once('toggleFootnotes', 'button.footnote__citation', context).forEach((btn) => {
        const $btn = $(btn);
        $btn.on('click', function () {
          $(this).siblings('.footnote__citation-text').toggleClass('active');
        })
      });

      // Handle "outside" click. So if user clicks on anywhere outside
      // footnote wrapper - close it.
      if (!once('toggleOutsideFootnoteClick', 'html').length) {
        // Early return avoid changing the indentation
        // for the rest of the code.
        return;
      }
      $(document).on('click', function (event) {
        let $activeFootnotes = $('.footnote__citation-text.active');
        let $target = $(event.target);
        if ($activeFootnotes !== undefined) {
          $activeFootnotes.each(function () {
            if (!$target.closest('.footnote__citations-wrapper').length
              && $(this).is(':visible')) {
              $(this).toggleClass('active');
            }
          })
        }
      })
    },
  };
})(jQuery, Drupal);
