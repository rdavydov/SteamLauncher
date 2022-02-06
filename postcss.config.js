module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting')(require('postcss-nesting')),
    require('tailwindcss'),
    require('postcss-preset-env')({
      features: {'nesting-rules': false},
    }),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './src/render/**/*.{js,ts,html}',
        './node_modules/bootstrap/js/dist/modal.js',
        './node_modules/bootstrap/js/dist/toast.js',
        './node_modules/bootstrap/js/dist/tooltip.js',
        './node_modules/markdown-it/dist/markdown-it.js',
      ],
      safelist: [/^bs-tooltip/, 'toast-success', 'toast-warning', 'toast-error', 'toast-info'],
    }),
    require('autoprefixer'),
  ],
};
