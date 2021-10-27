import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

async function loadLocaleMessages() {
    const locales = import.meta.glob('./locales/*.json')
    const messages = {}
    for (const path in locales) {
        const locale = path.match('^.*/(.*).json')?.[1]
        messages[locale] = await locales[path]()
    }

    return messages
}

export default new VueI18n({
    locale: navigator.language.split('-')[0] || 'fr',
    fallbackLocale: navigator.language.split('-')[0] || 'fr',
    messages: await loadLocaleMessages()
})
