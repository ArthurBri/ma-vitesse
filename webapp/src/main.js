import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import '@/assets/scss'
import './registerServiceWorker'
import i18n from './i18n'
import router from './router'

Vue.config.productionTip = false

new Vue({
    store,
    render: (h) => h(App),
    i18n,
    router,

    beforeCreate() {
        store.commit('initializeStore')
    }
}).$mount('#app')
