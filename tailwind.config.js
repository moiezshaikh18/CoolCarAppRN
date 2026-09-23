/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Enterprise-agnostic tokens — override via CSS vars or NativeWind dynamic
        primary: 'rgb(108, 76, 241)',
        secondary: 'rgb(79, 140, 255)',
        accent: 'rgb(0, 200, 150)',
        background: 'rgb(13, 11, 31)',
        surface: 'rgba(255, 255, 255, 0.08)',
        error: 'rgb(255, 77, 109)',
        success: 'rgb(0, 200, 150)',
        warning: 'rgb(255, 179, 71)',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        glass: '20px',
        button: '14px',
        input: '12px',
        chip: '20px',
      },
    },
  },
  plugins: [],
};

