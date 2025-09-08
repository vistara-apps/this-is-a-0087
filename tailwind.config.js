/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(225, 12%, 96%)',
        accent: 'hsl(170, 60%, 45%)',
        primary: 'hsl(220, 85%, 35%)',
        surface: 'hsl(225, 12%, 100%)',
        'text-primary': 'hsl(220, 10%, 15%)',
        'text-secondary': 'hsl(220, 10%, 40%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 10%, 15%, 0.1)',
        'modal': '0 8px 24px hsla(220, 10%, 15%, 0.12)',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}