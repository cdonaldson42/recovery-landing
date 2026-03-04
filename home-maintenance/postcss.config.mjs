const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "@csstools/postcss-cascade-layers": {},
    "postcss-lightningcss": {
      browsers: "Safari >= 14, iOS >= 14, Chrome >= 80, Firefox >= 90",
      lightningcssOptions: {
        drafts: {
          nesting: true,
        },
      },
    },
  },
};

export default config;
