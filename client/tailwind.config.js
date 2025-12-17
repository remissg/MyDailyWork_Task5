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
                primary: "#2563eb", // Blue 600 - Classic, trustworthy blue
                secondary: "#4f46e5", // Indigo 600
                dark: "#ffffff", // Pure White
                darker: "#ffffff", // Pure White (Enforce White Theme)
                light: "#1e293b", // Slate 800 (Text)
                surface: "#ffffff", // Pure White
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
