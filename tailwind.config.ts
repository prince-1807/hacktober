import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hacktober: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B00',
          600: '#EA580C',
          700: '#C2410C',
          850: '#8A2E0B',
          900: '#7C2D12',
          glow: 'rgba(255, 107, 0, 0.4)',
        },
        carbon: {
          bg: '#0A0A0C',
          surface: '#121214',
          card: '#161619',
          elevated: '#1D1D21',
          border: '#27272A',
          subtle: '#1F1F23',
          muted: '#52525B',
          text: '#F4F4F5',
          dim: '#A1A1AA',
        },
        tech: {
          gold: '#F59E0B',
          goldGlow: 'rgba(245, 158, 11, 0.25)',
          green: '#10B981',
          red: '#EF4444',
          blue: '#0284C7',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'orange-glow': '0 0 25px -4px rgba(255, 107, 0, 0.35)',
        'orange-glow-sm': '0 0 12px -2px rgba(255, 107, 0, 0.3)',
        'carbon-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
        'gold-glow': '0 0 16px -2px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
