module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                black: '#000',
                white: '#fff',
                primary: '#1D4E89',
                secondary: '#fc814a'
            }
        }
    },
    corePlugins: {},
    plugins: []
}
