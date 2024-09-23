(function ($, Drupal) {

  /**
   * JS behaviors for slider/image gallery within ckeditor.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.ckeditor5Images = {

    /**
     * Add extra content/track changes in slides/etc.
     */
    attach: function (context) {
      // Can not use `window` or `document` directly.
      if (!once('ckeditor5Images', 'html').length) {
        // Early return avoid changing the indentation
        // for the rest of the code.
        return;
      }
      let sliderElements = document.querySelectorAll('.paragraph--type--ckeditor-slides .swiffy-slider:not(.swiffy-slider__gallery-initialization-container)');
      Array.from(sliderElements).forEach(function (sliderElement) {
        swiffyslider.onSlideEnd(sliderElement, function () {
          const currentActiveSlide = sliderElement.querySelector('.active');
          const currentActiveSlideIndex = Array.from(sliderElement.querySelectorAll('.slider-indicators button')).indexOf(currentActiveSlide);
          // Now set the number of currently active slide in the appropriate
          // element.
          const currentActiveElement = sliderElement.querySelector('.ckeditor__swiffy-slider__slider-progress__current-index');
          currentActiveElement.textContent = (currentActiveSlideIndex + 1).toString();
        });
      });

      // On click handler for slides. If clicked - should open the slider
      // as gallery and slide to appropriate item.
      function imageClick(index, sliderElement) {
        setTimeout(() => {
          $(sliderElement).toggleClass('active');
          // Slide to the right image.
          swiffyslider.slideTo(sliderElement, index);
          // Listen to slide end and set focus to the container to enable keyboard navigation
          swiffyslider.onSlideEnd(sliderElement, () => sliderElement.querySelector(".slider-container").focus());
        }, 300)
      }

      // On click for slider item.
      $('.media--view-mode-ckeditor-slide-image .field--type-image').on('click', function () {
        // Find the index of clicked element.
        let $targetArrayItem = $(this).closest('.slider-container li');
        let $targetArray = $(this).closest('.slider-container').children('li');
        if ($targetArrayItem.length && $targetArray.length) {
          let targetIndex = Array.from($targetArray).indexOf($targetArrayItem[0]);
          imageClick(targetIndex, $targetArray.closest('.swiffy-slider').siblings('.swiffy-slider__gallery-wrapper').find('.swiffy-slider__gallery-initialization-container')[0]);
        }
      });

      // On click for embedded image.
      $('.media--view-mode-ckeditor-embedded .field--name-field-media-image > picture img').on('click', function () {
        // Here is index always 0.
        imageClick(0, $(this).closest('.field--name-field-media-image').find('.swiffy-slider__gallery-initialization-container')[0]);
      });

      // Close mark behavior.
      $('.swiffy__close-mark').on('click', function () {
        $(this).closest('.swiffy-slider').toggleClass('active');
      })
    },
  };
})(jQuery, Drupal);
