/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        azulF: "#152259",         // Azul oscuro
        azulM: "#2D88D4",         // Azul medio
        azulC: "#B9D7F1",         // Azul claro
        grisF: "#737373",         // Gris oscuro
        grisM: "#A3A3A3",         // Gris medio
        grisC: "#f5f5f5",         // Gris claro
        rojoC: "#f7180b",         // Rojo claro
        rojoF: "#9f0712",         // Rojo oscuro
      },
    },
  },
  plugins: [],
}
