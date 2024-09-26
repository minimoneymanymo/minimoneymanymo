/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-m1": "#60B2E0",
        "secondary-m2": "#478D81",
        "secondary-m3": "#E4F3F1",
        "tertiary-m4": "#FFBB1A",
        "tertiary-600-m4": "#FFBB1A",
        "primary-800": "#2565A1",
        "primary-700": "#2B76B5",
        "primary-600": "#3088C8",
        "primary-500": "#3395D7",
        "primary-400": "#45A4DC",
        "primary-200": "#89C7E9",
        "primary-100": "#B5DDF2",
        "secondary-900": "#335048",
        "secondary-800": "#3C6C63",
        "secondary-700": "#417D72",
        "secondary-600-m2": "#478D81",
        "secondary-500": "#4C9A8E",
        "secondary-400": "#57AA9F",
        "secondary-300": "#6CB9B0",
        "secondary-200": "#92CEC7",
        "secondary-100": "#BBE0DD",
        "secondary-50": "#E4F3F1",
        buy: "#F04452",
        sell: "#3182F6",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"), // 플러그인 추가
  ],
}
