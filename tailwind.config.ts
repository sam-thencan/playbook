import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                accent: '#FF6A00',
            },
            borderRadius: {
                card: '10px',
            },
            fontFamily: {
                sans: ['var(--font-sans)'],
            },
        },
    },
    plugins: [],
} satisfies Config


