<template>
    <div>
        <preloader v-if="showPreloader"/>
        <div class="bg-gray-800"></div>
        <div id="app" v-if="!showPreloader">
            <h1 class="app-description">
                <span class="text-4xl">{{ $t('global.app_subname') }}</span>
                <span class="mv-icon mv-icon-run ml-2 fill-current text-primary"/>
                <span class="mv-icon mv-icon-bike ml-2 "/>
                <span class="mv-icon mv-icon-hiking ml-2"/>
            </h1>
            <div class="body">
                <Calculator/>
                <div class="flex justify-center">
                    <transition name="fade">
                        <div class="tabs-menu" v-if="showTabMenu">
                            <div class="tabs">
                                <TabMenuItem :active="activeTab === 'laptime'" :hidden="!showLapTime"
                                             @click.native="setactiveTab('laptime')"
                                             :label="$t('laptime.title')" component="laptime"/>
                                <TabMenuItem :active="activeTab === 'predictions'" :hidden="!showPredictions"
                                             @click.native="setactiveTab('predictions')"
                                             :label="$t('predictions.title')" component="predictions"/>
                            </div>
                            <div class="tabs-content"
                                 v-if="showTabMenu">
                                <div class="p-6">
                                    <LapTime v-show="showLapTime && activeTab === 'laptime'"></LapTime>
                                    <Prediction v-show="showPredictions && activeTab === 'predictions'"/>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <router-view/>
            <Header/>
            <Footer/>
        </div>
    </div>
</template>

<script>
    import Header from '@/components/Header'
    import Calculator from '@/components/Calculator'
    import Prediction from '@/components/Prediction'
    import LapTime from '@/components/LapTime'
    import Settings from '@/components/Settings'
    import Preloader from '@/components/Preloader'
    import TabMenuItem from '@/components/TabMenuItem'
    import ShareSocial from '@/components/ShareSocial'

    export default {
        name: 'app',
        components: {Prediction, Calculator, LapTime, Settings, Header, Preloader, TabMenuItem, ShareSocial},
        data() {
            return {
                showPreloader: true,
                activeTab: ''
            }
        },
        mounted() {
            setTimeout(() => {
                this.showPreloader = false;
            }, 200);

            this.$i18n.locale = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.$i18n.locale;
            document.title = 'MA Vitesse | ' + this.$i18n.t('global.app_meta_title');
       

            // Définition de l'onglet / tab actif
            if (localStorage.getItem('activeTab')) {
                this.activeTab = localStorage.getItem('activeTab')
            } else {
                this.activeTab = this.showLapTime ? 'laptime' : this.showPredictions ? 'predictions' : ''
            }
        },
        computed: {
            showPredictions: {
                get() {
                    return this.$store.state.showPredictions
                }, set(newVal) {
                    this.$store.commit('showPredictions', newVal)
                }
            },
            showLapTime: {
                get() {
                    return this.$store.state.showLapTime
                }, set(newVal) {
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
                this.activeTab = tabToActivate;
                localStorage.setItem('activeTab', tabToActivate)
            }
        }
    }
</script>

<style lang="scss">
#app {
    @apply flex flex-col items-center self-stretch min-h-screen min-w-full ;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $ma-primary;
    z-index: 0;
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    backdrop-filter: blur(4px);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1038%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='url(%23SvgjsLinearGradient1039)'%3e%3c/rect%3e%3cpath d='M0 0L10.83 0L0 171.1z' fill='rgba(255%2c 255%2c 255%2c .1)'%3e%3c/path%3e%3cpath d='M0 171.1L10.83 0L144.12 0L0 323.26z' fill='rgba(255%2c 255%2c 255%2c .075)'%3e%3c/path%3e%3cpath d='M0 323.26L144.12 0L479.36 0L0 400.16999999999996z' fill='rgba(255%2c 255%2c 255%2c .05)'%3e%3c/path%3e%3cpath d='M0 400.16999999999996L479.36 0L1127.12 0L0 403.37999999999994z' fill='rgba(255%2c 255%2c 255%2c .025)'%3e%3c/path%3e%3cpath d='M1440 560L1310.3600000000001 560L1440 337.88z' fill='rgba(0%2c 0%2c 0%2c .1)'%3e%3c/path%3e%3cpath d='M1440 337.88L1310.3600000000001 560L755.5000000000001 560L1440 166.49z' fill='rgba(0%2c 0%2c 0%2c .075)'%3e%3c/path%3e%3cpath d='M1440 166.49L755.5 560L409.87 560L1440 128.3z' fill='rgba(0%2c 0%2c 0%2c .05)'%3e%3c/path%3e%3cpath d='M1440 128.3L409.8699999999999 560L322.4999999999999 560L1440 89.67000000000002z' fill='rgba(0%2c 0%2c 0%2c .025)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1038'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1039'%3e%3cstop stop-color='rgba(255%2c 255%2c 255%2c 1)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(190%2c 129%2c 54%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
}

.body {
    @apply flex flex-grow flex-wrap ml-0 justify-center w-1/2 items-start content-start
    pt-8 sm:pt-3 md:pt-4 lg:pt-4 overflow-hidden;
}

.app-description {
    @apply sm:mt-20 sm:text-lg md:text-xl lg:text-xl xl:my-12 text-xl;
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

h2, h1, p {
    margin: 0;
}

.tab {
    cursor: pointer;
}

.tabs-content {
    @apply flex flex-col text-white;
    @apply rounded-b-lg shadow-xl;
    background-color: rgba($ma-primary, 0.8);
    backdrop-filter: blur(2px);
    z-index: 0;
}

.tabs-menu {
    @apply flex;
    z-index: 0;
}
</style>
