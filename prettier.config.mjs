/** @type {import("prettier").Config} */
const config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 120,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
