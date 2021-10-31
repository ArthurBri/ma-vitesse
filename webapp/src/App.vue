<template>
    <div>
        <preloader v-if="showPreloader" />
        <div id="app" v-if="!showPreloader">
            <div class="body">
                <Calculator />
                <div class="flex justify-center w-full">
                    <transition name="fade">
                        <div class="tabs-menu" v-if="showTabMenu">
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
            </div>
            <router-view />
            <Footer />
        </div>
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Calculator from '@/components/Calculator.vue'
import Prediction from '@/components/Prediction.vue'
import LapTime from '@/components/LapTime.vue'
import Settings from '@/components/Settings.vue'
import Preloader from '@/components/Preloader.vue'
import TabMenuItem from '@/components/TabMenuItem.vue'
import ShareSocial from '@/components/ShareSocial.vue'

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
        ShareSocial
    },
    data() {
        return {
            showPreloader: true,
            activeTab: ''
        }
    },
    mounted() {
        setTimeout(() => {
            this.showPreloader = false
        }, 200)

        this.$i18n.locale = localStorage.getItem('lang') || this.$i18n.locale
        document.title = 'MA Vitesse | ' + this.$i18n.t('global.app_meta_title')

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
        }
    }
}
</script>

<style lang="scss">
@import './assets/scss/_variables';

#app {
    @apply flex flex-col text-primary items-center self-stretch min-h-screen min-w-full bg-gray-100;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    z-index: 0;
    position: relative;
}

.body {
    @apply flex flex-grow flex-wrap ml-0 justify-center w-full lg:w-2/3 items-start content-start
    lg:pt-8 sm:pt-3 md:pt-4 overflow-hidden;
}

.app-description {
    @apply hidden lg:flex items-center mt-10 sm:text-lg md:text-xl lg:text-xl xl:my-12 text-xl;
}

.tabs {
    @apply flex flex-col mr-1 gap-1;
}

.tabs-menu {
    @apply flex w-full lg:w-full justify-center;
}

h2,
h1,
p {
    margin: 0;
}

.tabs-content-wrapper {
    @apply flex flex-col w-1/2 overflow-auto border-gray-200 border rounded-lg bg-white p-6;
    min-height: 20rem;
    max-height: 50vh;
}
</style>
