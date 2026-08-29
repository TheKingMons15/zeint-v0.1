/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',   // Large mobile / mini tablet
      'md': '768px',   // Tablet breakpoint
      'lg': '1024px',  // Small Desktop / Landscape tablet
      'xl': '1280px',  // Desktop breakpoint
      '2xl': '1536px', // Large monitor
    },
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Apple HIG Dark Mode Palette
        apple: {
          canvas: '#05070B',
          card: '#0F121A',
          cardHover: '#161B26',
          elevated: '#1A202C',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.15)',
          separator: 'rgba(255, 255, 255, 0.06)',
          glass: 'rgba(15, 18, 26, 0.75)',
          glassSheet: 'rgba(15, 18, 26, 0.88)',
          tintBlue: '#0A84FF',
          tintGreen: '#30D158',
          tintIndigo: '#5E5CE6',
          tintOrange: '#FF9F0A',
          tintPink: '#FF375F',
          tintPurple: '#BF5AF2',
          tintRed: '#FF453A',
          tintTeal: '#64D2FF',
          tintYellow: '#FFD60A',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px'
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.25)',
        'apple-md': '0 6px 20px rgba(0, 0, 0, 0.35)',
        'apple-lg': '0 12px 36px rgba(0, 0, 0, 0.45)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'apple-glow-emerald': '0 0 24px -4px rgba(52, 211, 153, 0.25)',
        'apple-glow-amber': '0 0 24px -4px rgba(245, 158, 11, 0.25)',
        'apple-glow-purple': '0 0 24px -4px rgba(168, 85, 247, 0.25)',
        'apple-glow-blue': '0 0 24px -4px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
