/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f1115',
          surface: '#1a1d23',
        },
        border: {
          subtle: '#2a2f37',
        },
        accent: {
          blue: '#2563eb',
        }
      },
      backgroundColor: {
        'bg-primary': '#0f1115',
        'bg-surface': '#1a1d23',
      },
      borderColor: {
        'border-subtle': '#2a2f37',
      },
    },
  },
  plugins: [],
}
