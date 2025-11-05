import type { Config } from 'tailwindcss';
import baseConfig from '../ui/tailwind.config.js';

const config: Config = {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}', '../ui/src/**/*.{ts,tsx}'],
};

export default config;
