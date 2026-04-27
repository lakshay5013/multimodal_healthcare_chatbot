/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-bg': '#0B1220',
        'navy-deep': '#060D16',
        'card': '#111827',
        'card-hover': '#1a2332',
        'card-border': 'rgba(255,255,255,0.06)',
        'electric': '#00D4FF',
        'cyan-accent': '#06B6D4',
        'electric-dim': 'rgba(0,212,255,0.15)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-out-left': 'slideOutLeft 0.3s ease-in forwards',
        'slide-out-right': 'slideOutRight 0.3s ease-in forwards',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'count-up': 'countUp 1s ease-out forwards',
        'pulse-alert': 'pulseAlert 2s ease-in-out infinite',
        'typing-cursor': 'typingCursor 1s step-end infinite',
        'skeleton-shimmer': 'skeletonShimmer 1.5s ease-in-out infinite',
        'card-appear': 'cardAppear 0.5s ease-out forwards',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'ring-pulse': 'ringPulse 2s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'bar-grow': 'barGrow 1s ease-out forwards',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseAlert: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' },
        },
        typingCursor: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#00D4FF' },
        },
        skeletonShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        cardAppear: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.25)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.12)' },
          '56%': { transform: 'scale(1)' },
        },
        ringPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        barGrow: {
          '0%': { height: '0%' },
          '100%': { height: 'var(--bar-height)' },
        },
      },
    },
  },
  plugins: [],
};
