const postcssPurgeCss = require('@fullhuman/postcss-purgecss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssNesting = require('postcss-nesting');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const tailwindcssNesting = require('tailwindcss/nesting');

module.exports = {
  plugins: [
    postcssImport,
    tailwindcssNesting(postcssNesting),
    tailwindcss,
    postcssPresetEnv({
      features: {
        'nesting-rules': false,
      },
    }),
    postcssPurgeCss({
      content: [
        './src/render/src/**/*.{js,ts,html}',
        './node_modules/bootstrap/js/dist/modal.js',
        './node_modules/bootstrap/js/dist/toast.js',
        './node_modules/markdown-it/dist/markdown-it.js',
      ],
      safelist: [
        /* !.class tailwindcss */
        /^!(.+)/u,
      ],
    }),
    autoprefixer,
  ],
};
