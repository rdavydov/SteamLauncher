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
        './src/render/src/**/*.{js,ts,html}',
        './node_modules/bootstrap/js/dist/modal.js',
        './node_modules/bootstrap/js/dist/toast.js',
        './node_modules/markdown-it/dist/markdown-it.js',
      ],
      safelist: [
        /* !.class tailwindcss */
        /^!(.+)/,
      ],
    }),
    require('autoprefixer'),
  ],
};
