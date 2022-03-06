const aspectRatio = require('@tailwindcss/aspect-ratio');
const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  content: [
    './src/render/src/**/*.{js,ts,html}',
    './node_modules/bootstrap/js/dist/modal.js',
    './node_modules/bootstrap/js/dist/toast.js',
    './node_modules/markdown-it/dist/markdown-it.js',
  ],
  plugins: [
    forms,
    typography,
    lineClamp,
    aspectRatio,
  ],
  theme: {
    extend: {
      colors: {
        primary: '#161920',
        secondary: '#1f232e',
      },
    },
  },
};
