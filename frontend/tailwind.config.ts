import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'light-gold': '#F5E6A3',
        'dark-bg': '#0D0D0D',
        'card-bg': '#1A1A1A',
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #8B7320 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
