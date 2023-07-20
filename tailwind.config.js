/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('daisyui')],

  theme: {
    fontSize: {
      'xl' : '0.5rem',
      '2xl' : '2rem',
      '3xl' : '3rem',
      '4xl' : '4rem',
      '5xl' : '5rem',
      '6xl' : '6rem',
      '7xl' : '7rem',
      '8xl' : '8rem',
      '9xl' : '12rem'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
}
