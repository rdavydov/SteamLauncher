/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: ['./src/render/**/*.{js,ts,html}'],
  theme: {
    extend: {
      colors: {
        steamlauncher: '#161920',
        'steamlauncher-container': '#1f232e',
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
