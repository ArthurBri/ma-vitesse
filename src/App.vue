<template>
    <div>
        <preloader v-if="showPreloader" />
        <div id="app" v-if="!showPreloader">
            <div class="body">
                <Calculator />
                <div class="flex xl:hidden mb-10">
                    <shared-workouts />
                </div>
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
            <Footer />
            <router-view />
            <shared-workouts class="fixed hidden xl:flex right-8 top-24" />
        </div>
    </div>
</template>

<script>
import Footer from '@/components/organisms/Footer.vue'
import Calculator from '@/components/Calculator.vue'
import Prediction from '@/components/Prediction.vue'
import LapTime from '@/components/LapTime.vue'
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
            activeTab: ''
        }
    },
    mounted() {
        setTimeout(() => {
            this.showPreloader = false
        }, 200)

        this.$i18n.locale = localStorage.getItem('language') || this.$i18n.locale
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
    @apply flex flex-grow flex-wrap ml-0 justify-center w-full xl:w-2/3 items-start content-start
    lg:pt-8 sm:pt-3 md:pt-4 overflow-hidden;
    margin-bottom: $footer-height;
}

.tabs {
    @apply flex lg:flex-col overflow-auto lg:mb-1 lg:mr-1 lg:gap-1;
}

.tabs-menu {
    @apply flex flex-col lg:flex-row w-full lg:w-full justify-center;
}

h2,
h1,
p {
    margin: 0;
}

.tabs-content-wrapper {
    @apply flex flex-col lg:w-2/3 xl:w-1/2 overflow-auto border-gray-200 border lg:rounded-lg bg-white p-6;
    min-height: 20rem;
    max-height: 50vh;
}
</style>
