Bootcamp Theme was generated from starterkit_theme.

Additional information on generating themes can be found in the [Starterkit documentation](https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme).

It provides:

1. Some breakpoints for 1x and 2x pixel ratio, adapt it according your breakpoints
  - Pay attention to weight value, smaller device should have smaller weight

2. Check `bootcamp_theme.libraries.yml` to see how to conditionnaly load CSS files according media queries
  - for example `node/layout-desktop.css` will be loaded only from device width 1148px

3. The Gulpfile.js is providing
  - SASS convertion to css
  - Minification of js files with mangle
  - Generate sprite of all your SVG icons

**Double-check if the node container is running and working with your theme.
Otherwise, you will see 404 errors in the console
because libraries files are not generated.**

4. Critical Fonts are preloaded, and css font declaration are inline in head
see bootcamp_theme_page_attachments_alter HOOK in `bootcamp_theme.theme` file for more information, and customize it according font of your project

TODO: add different set of fonts according  direction (LTR or RTL)
