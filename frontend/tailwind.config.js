/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        novig: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          dark: '#0a0e1a',
          card: '#0f1420',
          accent: '#a78bfa',
        },
      },
      backgroundImage: {
        'novig-gradient': 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
        'novig-radial':
          'radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 60%), radial-gradient(circle at bottom right, rgba(59,130,246,0.25), transparent 60%)',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(124, 58, 237, 0.4)',
      },
    },
  },
  plugins: [],
};
