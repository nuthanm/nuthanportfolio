/** @type {import('tailwindcss').Config} */

// Semantic colour tokens backed by CSS variables (see src/index.css).
// Each variable holds space-separated RGB channels so Tailwind opacity
// modifiers like `bg-accent/10` keep working in both themes.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: token('bg'),
        subtle: token('subtle'),
        card: token('card'),
        line: token('line'),
        fg: token('fg'),
        'fg-2': token('fg-2'),
        'fg-3': token('fg-3'),
        accent: token('accent'),
        'accent-strong': token('accent-strong'),
        'on-accent': token('on-accent'),

        // Legacy names kept so older components and legal pages follow the theme.
        primary: token('bg'),
        surface: token('subtle'),
        muted: token('fg-3'),
        'accent-light': token('accent-strong'),
        'text-main': token('fg'),
        'text-secondary': token('fg-2'),
      },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--shadow) / 0.04), 0 8px 24px -12px rgb(var(--shadow) / 0.12)',
        lift: '0 2px 4px rgb(var(--shadow) / 0.05), 0 20px 40px -20px rgb(var(--shadow) / 0.25)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
