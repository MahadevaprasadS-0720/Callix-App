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
          bg: '#0B0F19',
          card: '#111827',
          cardHover: '#1A2234',
          border: '#1E293B',
          borderLight: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
        threat: {
          safe: '#10B981',       // Green
          safeBg: 'rgba(16, 185, 129, 0.12)',
          suspicious: '#F59E0B', // Amber
          suspiciousBg: 'rgba(245, 158, 11, 0.12)',
          fraud: '#EF4444',      // Red
          fraudBg: 'rgba(239, 68, 68, 0.15)',
          critical: '#DC2626',   // Deep Red
          criticalBg: 'rgba(220, 38, 38, 0.22)',
        },
        brand: {
          primary: '#6366F1',    // Electric Indigo
          cyan: '#06B6D4',       // Neon Cyan
          purple: '#8B5CF6',     // Violet
          glow: 'rgba(99, 102, 241, 0.25)',
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-danger': '0 0 25px rgba(239, 68, 68, 0.45)',
        'glow-safe': '0 0 20px rgba(16, 185, 129, 0.35)',
        'card-cyber': '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
