<template>
    <div>
        <preloader v-if="showPreloader" />
        <div id="app" v-if="!showPreloader">
            <h1 class="app-description">
                <span class="text-4xl font-bold">{{ $t('global.app_subname') }}</span>
                <span class="mv-icon mv-icon-run ml-2 fill-current text-primary" />
                <span class="mv-icon mv-icon-bike ml-2" />
                <span class="mv-icon mv-icon-hiking ml-2" />
            </h1>
            <div class="body">
                <Calculator />
                <div class="flex justify-center">
                    <transition name="fade">
                        <div class="tabs-menu" v-if="showTabMenu">
                            <div class="tabs">
                                <TabMenuItem
                                    :active="activeTab === 'laptime'"
                                    :hidden="!showLapTime"
                                    @click.native="setactiveTab('laptime')"
                                    :label="$t('laptime.title')"
                                    component="laptime"
                                />
                                <TabMenuItem
                                    :active="activeTab === 'predictions'"
                                    :hidden="!showPredictions"
                                    @click.native="setactiveTab('predictions')"
                                    :label="$t('predictions.title')"
                                    component="predictions"
                                />
                            </div>
                            <div class="tabs-content" v-if="showTabMenu">
                                <div class="p-6">
                                    <LapTime v-show="showLapTime && activeTab === 'laptime'"></LapTime>
                                    <Prediction v-show="showPredictions && activeTab === 'predictions'" />
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <router-view />
            <Header />
            <Footer />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
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
        Header,
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

        this.$i18n.locale = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.$i18n.locale
        document.title = 'MA Vitesse | ' + this.$i18n.t('global.app_meta_title')

        this.activeTab = localStorage.getItem('activeTab')
            ? localStorage.getItem('activeTab')
            : (this.activeTab = this.showLapTime ? 'laptime' : this.showPredictions ? 'predictions' : '')
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
    @apply flex flex-col items-center self-stretch min-h-screen min-w-full bg-gray-100;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $ma-primary;
    z-index: 0;
    position: relative;
}

.body {
    @apply flex flex-grow flex-wrap ml-0 justify-center w-2/3 items-start content-start
    pt-8 sm:pt-3 md:pt-4 lg:pt-4 overflow-hidden;
}

.app-description {
    @apply flex items-center sm:mt-20 sm:text-lg md:text-xl lg:text-xl xl:my-12 text-xl;
}

.tabs {
    @apply flex flex-col;
}

.tabs-content {
    @apply rounded-lg rounded-tl-none;
}

.tabs-menu {
    @apply flex sm:w-full;
}

h2,
h1,
p {
    margin: 0;
}

.tab {
    cursor: pointer;
}

.tabs-content {
    @apply flex flex-col text-white;
    @apply rounded-b-lg;
    background-color: rgba($ma-primary, 0.8);
    backdrop-filter: blur(2px);
    z-index: 0;
}

.tabs-menu {
    @apply flex;
    z-index: 0;
}
</style>
