/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: [
    './src/render/src/**/*.{js,ts,html}',
    './node_modules/bootstrap/js/dist/modal.js',
    './node_modules/bootstrap/js/dist/toast.js',
    './node_modules/markdown-it/dist/markdown-it.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#161920',
        secondary: '#1f232e',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
