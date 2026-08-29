/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#000000',
          surface: '#09090B',
          card: '#0C0C0E',
          cardHover: '#141417',
          border: 'rgba(255, 255, 255, 0.08)',
          borderLight: 'rgba(255, 255, 255, 0.15)',
          text: '#EDEDED',
          muted: '#A1A1AA',
          subtle: '#71717A',
        },
        threat: {
          safe: '#10B981',       // Emerald
          safeBg: 'rgba(16, 185, 129, 0.12)',
          suspicious: '#F59E0B', // Amber
          suspiciousBg: 'rgba(245, 158, 11, 0.12)',
          fraud: '#EF4444',      // Red
          fraudBg: 'rgba(239, 68, 68, 0.15)',
          critical: '#DC2626',   // Deep Red
          criticalBg: 'rgba(220, 38, 38, 0.22)',
        },
        brand: {
          primary: '#FFFFFF',    // Resend crisp white primary
          indigo: '#6366F1',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          glow: 'rgba(255, 255, 255, 0.15)',
        },
        resend: {
          black: '#000000',
          surface: '#09090B',
          card: '#0E0E12',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)',
          text: '#F4F4F5',
          muted: '#A1A1AA',
          subtle: '#71717A',
        }
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(255, 255, 255, 0.15)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.25)',
        'glow-danger': '0 0 25px rgba(239, 68, 68, 0.35)',
        'glow-safe': '0 0 20px rgba(16, 185, 129, 0.25)',
        'card-cyber': '0 8px 30px rgba(0, 0, 0, 0.8)',
        'resend-button': '0 0 0 1px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.4), 0 12px 24px rgba(0, 0, 0, 0.4)',
        'resend-glow': '0 0 40px -10px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'border-beam': 'border-beam 6s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Domaine', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Commit Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
