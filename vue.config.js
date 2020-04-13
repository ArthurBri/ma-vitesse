module.exports = {
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config
                .output
                .filename('[name].[hash].js')
                .end()
        }
    },

    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/scss/_variables.scss";`
            }
        },
        extract: false
    },

    pluginOptions: {
        i18n: {
            locale: 'fr',
            fallbackLocale: 'fr',
            localeDir: 'locales',
            enableInSFC: false
        }
    }
};
