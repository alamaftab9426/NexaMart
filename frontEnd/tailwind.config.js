/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
    
  },
  plugins: [],
};

// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
     
      clipPath: {
        wave: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
        diagonal: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }
    },
    extend: {
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        rotate: 'rotate 4s linear infinite',
      },
    },
  },


  plugins: [],
}

