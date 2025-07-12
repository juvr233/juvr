/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // 启用基于class的暗色模式
  theme: {
    extend: {
      // Add custom transform utilities for 3D card flipping effects
      transform: {
        'perspective-1000': 'perspective(1000px)',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      colors: {
        // 亮色主题色彩
        light: {
          primary: '#F5F8FF',
          secondary: '#EAEEFF',
          accent: '#8A2BE2',
          text: '#1A1B25',
          textSecondary: '#4B4C57',
          border: 'rgba(138, 43, 226, 0.2)',
        },
        // 暗色主题色彩（与现有一致）
        dark: {
          primary: '#101118',
          secondary: '#22232E',
          accent: '#8A2BE2',
          accentSecondary: '#FF00FF', 
          text: '#FFFFFF',
          textSecondary: '#A0A0A0',
          border: 'rgba(138, 43, 226, 0.2)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 rgba(138, 43, 226, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(138, 43, 226, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
