import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'
import '@/assets/scss'
import '../registerServiceWorker'
import i18n from './i18n'
import router from './router'

import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore/lite'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
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

        const auth = getAuth()
        const db = getFirestore(firebaseApp)

        signInAnonymously(auth).then(async function (auth) {
            const userDoc = doc(db, 'users', auth.user.uid)
            await setDoc(userDoc, {
                timestamp: serverTimestamp()
            })
        })

        Vue.prototype.$db = getFirestore(firebaseApp)
    }
}).$mount('#app')
