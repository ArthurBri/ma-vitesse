module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        black: '#000',
        white: '#fff',
        primary: '#2C629D',
        secondary: '#FF9900',
      }
    }
  },
  corePlugins: {},
  plugins: [],
};
