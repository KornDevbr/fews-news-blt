(function ($, Drupal) {

  /**
   * JS behaviors for language switcher.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.toggleLanguageSwitcher = {
    /**
     * Toggles a class on click.
     */
    attach: function (context) {
      $(once('toggleLanguageSwitcher', '.language-links-wrapper button')).on('click', function () {
        $(this).siblings('.links').toggleClass('active');
      });

      // Handle "outside" click. So if user clicks on anywhere outside
      // switcher wrapper - hide links.
      // Can not use `window` or `document` directly.
      if (!once('toggleOutsideSwitcherClick', 'html').length) {
        // Early return avoid changing the indentation
        // for the rest of the code.
        return;
      }
      $(document).on('click', function (event) {
        if ($('.language-links-wrapper.open') !== undefined) {
          let $target = $(event.target);
          let $links = $('.language-links-wrapper .links');
          if (!$target.closest('.language-switcher-language-url').length
            && $links.is(':visible')) {
            $('.language-links-wrapper').removeClass('open');
            $('[data-once="toggleLanguageSwitcher"]').attr('aria-expanded', 'false');
            $links.removeClass('active');
          }
        }
      })
    },
  };
})(jQuery, Drupal);
