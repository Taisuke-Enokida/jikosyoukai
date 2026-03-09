import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        mellow: '0 18px 45px -22px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
