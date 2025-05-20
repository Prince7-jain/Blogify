/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#f3f4f6",
      },
    }
  },
  plugins: [
    (await import('@tailwindcss/typography')).default,
    (await import('tailwindcss-animate')).default,
  ],
} 