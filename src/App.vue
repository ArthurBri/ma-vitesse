<template>
    <div>
        <preloader v-if="showPreloader" />
        <div id="app" v-else>
            <div class="body">
                <Calculator />
                <section class="flex items-center">
                    <share-social />
                </section>
                <section class="flex">
                    <shared-workouts />
                </section>
            </div>
            <button class="mv-btn fixed bg-primary text-white stroke-current top-2 right-2 py-2" @click="toggleModules">
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
            <div class="components-pane" :class="showModules ? 'block' : 'hidden lg:block'">
                <transition name="fade">
                    <div class="tabs-menu" v-if="showTabMenu">
                        <div class="flex justify-center mb-4">
                            <button @click="toggleModules" class="mv-btn lg:hidden bg-secondary text-white flex py-1 mr-4 gap-2">
                                Close
                            </button>
                        </div>
                        <div class="tabs">
                            <TabMenuItem
                                :isActive="activeTab === 'laptime'"
                                :isVisible="showLapTime"
                                @click.native="setactiveTab('laptime')"
                                :label="$t('laptime.title')"
                                component="laptime"
                            />
                            <TabMenuItem
                                :isActive="activeTab === 'predictions'"
                                :isVisible="showPredictions"
                                @click.native="setactiveTab('predictions')"
                                :label="$t('predictions.title')"
                                component="predictions"
                            />
                        </div>
                        <div class="tabs-content-wrapper">
                            <LapTime v-show="showLapTime && activeTab === 'laptime'"></LapTime>
                            <Prediction v-show="showPredictions && activeTab === 'predictions'" />
                        </div>
                    </div>
                </transition>
            </div>
            <router-view />
        </div>
        <Footer />
    </div>
</template>

<script>
import Footer from '@/components/organisms/Footer.vue'
import Calculator from '@/components/Calculator.vue'
import Prediction from '@/components/organisms/modules/Prediction.vue'
import LapTime from '@/components/organisms/modules/LapTime.vue'
import Settings from '@/components/Settings.vue'
import Preloader from '@/components/Preloader.vue'
import TabMenuItem from '@/components/TabMenuItem.vue'
import ShareSocial from '@/components/ShareSocial.vue'
import SharedWorkouts from '@/components/SharedWorkouts.vue'

export default {
    name: 'app',
    components: {
        Prediction,
        Calculator,
        LapTime,
        Settings,
        Footer,
        Preloader,
        TabMenuItem,
        ShareSocial,
        SharedWorkouts
    },
    data() {
        return {
            showPreloader: true,
            activeTab: '',
            showModules: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.showPreloader = false
        }, 200)

        this.$i18n.locale = localStorage.getItem('language') || this.$i18n.locale
        document.title = 'Vitess | ' + this.$i18n.t('global.app_meta_title')

        this.activeTab = localStorage.getItem('activeTab') || this.showLapTime ? 'laptime' : this.showPredictions ? 'predictions' : ''
    },
    computed: {
        showPredictions: {
            get() {
                return this.$store.state.showPredictions
            },
            set(newVal) {
                this.$store.commit('showPredictions', newVal)
            }
        },
        showLapTime: {
            get() {
                return this.$store.state.showLapTime
            },
            set(newVal) {
                this.$store.commit('showLapTime', newVal)
            }
        },
        showTabMenu() {
            return this.showPredictions || this.showLapTime
        }
    },
    watch: {
        showPredictions() {
            this.activeTab = this.showPredictions ? 'predictions' : 'laptime'
        },
        showLapTime() {
            this.activeTab = this.showLapTime ? 'laptime' : 'predictions'
        }
    },
    methods: {
        setactiveTab(tabToActivate) {
            this.activeTab = tabToActivate
            localStorage.setItem('activeTab', tabToActivate)
        },
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

<style lang="scss">
@import './assets/scss/_variables';

@font-face {
    font-family: 'WorkSans';
    src: url('./assets/fonts/WorkSans.ttf');
}

html {
    @apply bg-gray-100;
}

#app {
    @apply flex text-primary items-start self-stretch h-screen w-screen bg-gray-100;
    font-family: 'WorkSans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    z-index: 0;
    position: relative;
}

.body {
    @apply flex flex-col items-center justify-center flex-grow flex-wrap ml-0 w-full lg:w-2/3
    lg:pt-8 pt-3 md:pt-4 overflow-hidden;
    padding-bottom: $footer-height;
}

section {
    @apply py-4;
}

.tabs {
    @apply flex  overflow-auto lg:mb-1 lg:mr-1 lg:gap-1;
}

.tabs-menu {
    @apply flex flex-col p-2;
}

h2,
h1,
p {
    margin: 0;
}

.tabs-content-wrapper {
    @apply flex flex-col border-gray-200 border rounded-2xl lg:rounded-3xl bg-white p-6 mt-4 w-full justify-start overflow-auto;
    max-height: 50vh;
}

.shared-workouts {
    width: 400px;
}

.components-pane {
    @apply w-screen fixed top-0 lg:relative lg:block h-screen lg:w-1/3 overflow-auto pl-4 pr-4 pt-4 lg:rounded-tl-3xl bg-primary;
}

@screen md {
    .components-pane {
        padding-bottom: $footer-height;
    }
}
</style>
