import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { gold: '#D4AF37', 'light-gold': '#F5E6A3', 'dark-bg': '#0D0D0D', 'card-bg': '#1A1A1A' },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
