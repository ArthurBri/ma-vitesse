import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import '@/assets/scss'
import '../registerServiceWorker'
import i18n from './i18n'
import router from './router'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
    apiKey: 'AIzaSyDZtOkOz7gKl_3cLr6oDVHD5gwifH8NuIw',
    authDomain: 'ma-vitesse.firebaseapp.com',
    projectId: 'ma-vitesse',
    storageBucket: 'ma-vitesse.appspot.com',
    messagingSenderId: '410838905826',
    appId: '1:410838905826:web:7d2e0a9eb8052e90b13fbb'
}

Vue.config.productionTip = false

new Vue({
    store,
    render: (h) => h(App),
    i18n,
    router,

    beforeCreate() {
        store.commit('initializeStore')
        const firebaseApp = initializeApp(firebaseConfig)
        Vue.prototype.$db = getFirestore(firebaseApp)
    }
}).$mount('#app')
