(function ($, Drupal) {

  /**
   * JS behaviors for hamburger menu.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.toggleHamburgerMenu = {
    /**
     * Toggles a class on click.
     */
    attach: function (context) {
      $(once('toggleHamburgerMenu', '.hamburger-trigger')).on('click', function () {
        console.log('toggleHamburgerMenu');
        $('.under-header-section').toggleClass('active');
      });

      // Handle "outside" click. So if user clicks on anywhere outside
      // under header section - hide it.
      // Can not use `window` or `document` directly.
      if (!once('toggleOutsideClickMenu', 'html').length) {
        // Early return avoid changing the indentation
        // for the rest of the code.
        return;
      }
      $(document).on('click', function (event) {
        let activeSectionSelector = '.under-header-section.active';
        if ($(activeSectionSelector) !== undefined) {
          let $target = $(event.target);
          if (!$target.closest(activeSectionSelector).length
            && $(activeSectionSelector).is(':visible') && !$target.closest('.hamburger-trigger').length) {
            $(activeSectionSelector).toggleClass('active')
          }
        }
      })
    },
  };
})(jQuery, Drupal);
