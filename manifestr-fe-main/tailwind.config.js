/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          background: '#ffffff',
          foreground: '#18181b',
          muted: '#f4f4f5',
          'muted-foreground': '#71717a',
          'muted-foreground+': '#52525b',
          secondary: '#18181b',
          'secondary-foreground': '#ffffff',
          border: '#e4e4e7',
          'card-foreground': '#09090b',
          transparent: 'rgba(255, 255, 255, 0)',
        },
        zinc: {
          200: '#e4e4e7',
        },
        gray: {
          300: '#d1d5db',
        },
        // Additional colors from design
        miscellaneous: {
          'floating-tab-text-unselected': '#090909',
          'keyboard-emoji-mic': 'rgba(27, 31, 38, 0.72)',
        },
      },
      fontFamily: {
        sans: [
          'Hanken Grotesk',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        // Title font for special headings
        title: ['Roboto', 'sans-serif'],
        // Hero font (Hanken Grotesk as primary)
        hero: [
          'Hanken Grotesk',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        // Accent font (Playfair Display for italic parts)
        accent: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        // Castoro Titling font
        'castoro-titling': ['Castoro Titling', 'serif'],
        // MonteCarlo font
        'monte-carlo': ['MonteCarlo', 'cursive'],
        // IvyPresto Headline font
        'ivy-presto': ['IvyPresto Headline', 'serif'],
      },
      fontSize: {
        // Typography scale from design system
        'body-base': ['16px', { lineHeight: '1.4', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        // Label sizes
        'l1-semibold': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'l1-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'l2-semibold': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'l2-medium': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'l2-regular': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        // Body sizes
        'b1-semibold': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'b1-medium': ['18px', { lineHeight: '28px', fontWeight: '500' }],
        'b2-regular': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'b2-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        // Caption sizes
        'c1-medium': ['12px', { lineHeight: '18px', fontWeight: '500' }],
        'c1-regular': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        // Title sizes
        't1-semibold': ['20px', { lineHeight: '30px', fontWeight: '600' }],
      },
      spacing: {
        // Design system spacing scale
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
      },
      borderRadius: {
        md: '6px',
        xl: '12px',
      },
      screens: {

      },
      boxShadow: {
        // Add custom shadows if needed from design
      },
    },
  },
  plugins: [],
}
