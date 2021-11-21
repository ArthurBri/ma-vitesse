<template>
    <div class="app">
        <preloader v-if="showPreloader" />
        <div class="main-wrapper">
            <div class="main-pane w-full">
                <Calculator />
                <section>
                    <share-buttons />
                </section>
                <section>
                    <shared-workouts />
                </section>
            </div>
            <div class="modules-pane">
                <modules :modalVisible="showModules" @close="showModules = !showModules" />
            </div>
        </div>
        <router-view />
        <Footer />
        <button
            v-if="!showModules"
            class="lg:hidden vi-btn fixed bg-primary text-white stroke-current top-2 right-2 py-2"
            @click="toggleModules"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-apps h-6 w-6"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
                <line x1="14" y1="7" x2="20" y2="7" />
                <line x1="17" y1="4" x2="17" y2="10" />
            </svg>
        </button>
    </div>
</template>

<script>
import Footer from '@/components/organisms/Footer.vue'
import Calculator from '@/components/Calculator.vue'
import Modules from '@/components/organisms/Modules.vue'
import Settings from '@/components/Settings.vue'
import Preloader from '@/components/Preloader.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import SharedWorkouts from '@/components/SharedWorkouts.vue'

export default {
    name: 'Vitess',
    components: {
        Calculator,
        Modules,
        Settings,
        Footer,
        Preloader,
        ShareButtons,
        SharedWorkouts
    },
    data() {
        return {
            showPreloader: true,
            showModules: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.showPreloader = false
        }, 200)

        this.$i18n.locale = localStorage.getItem('language') || this.$i18n.locale
        document.title = 'Vitess | ' + this.$i18n.t('global.app_meta_title')
    },
    methods: {
        toggleModules() {
            this.showModules = !this.showModules
            if (this.showModules) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'auto'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@font-face {
    font-family: 'WorkSans';
    src: url('./assets/fonts/WorkSans.ttf');
}

html {
    @apply bg-gray-100;
}

.main-wrapper {
    @apply flex relative z-0 text-primary self-stretch w-screen bg-gray-100 lg:pb-0 min-h-screen;
    font-family: 'WorkSans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding-bottom: $footer-height;

    @screen md {
        padding-bottom: 0;
    }
}

.main-pane {
    @apply flex flex-col justify-center items-center;
}

section {
    @apply flex items-center py-4;
}

.shared-workouts {
    width: 400px;
}

.modules-pane {
    @apply w-screen lg:w-1/3 fixed left-0 top-0 lg:relative lg:block h-screen overflow-auto lg:rounded-tl-3xl;
}
</style>
