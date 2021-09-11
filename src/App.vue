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
                <div class="w-3/4 flex justify-center">
                    <transition name="fade">
                        <div class="tabs-menu" v-if="showTabMenu">
                            <div class="tabs">
                                <TabMenuItem :active="tabActive === 'laptime'" :hidden="!showLapTime"
                                             @click.native="setTabActive('laptime')"
                                             :label="$t('laptime.title')" component="laptime"/>
                                <TabMenuItem :active="tabActive === 'predictions'" :hidden="!showPredictions"
                                             @click.native="setTabActive('predictions')"
                                             :label="$t('predictions.title')" component="predictions"/>
                            </div>
                            <div class="tabs-content"
                                 v-if="showTabMenu">
                                <div class="p-6">
                                    <LapTime v-show="showLapTime && tabActive === 'laptime'"></LapTime>
                                    <Prediction v-show="showPredictions && tabActive === 'predictions'"/>
                                </div>
                            </div>
                        </div>
                        <!-- FIN TABS -->
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
                tabActive: ''
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
                this.tabActive = localStorage.getItem('activeTab')
            } else {
                this.tabActive = this.showLapTime ? 'laptime' : this.showPredictions ? 'predictions' : ''
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
                this.tabActive = this.showPredictions ? 'predictions' : 'laptime'
            },
            showLapTime() {
                this.tabActive = this.showLapTime ? 'laptime' : 'predictions'
            }
        },
        methods: {
            setTabActive(tabToActivate) {
                this.tabActive = tabToActivate;
                localStorage.setItem('activeTab', tabToActivate)
            }
        }
    }
</script>

<style lang="scss">

    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: $ma-primary;
      z-index: 0;
      position: relative;
      @apply flex flex-col items-center self-stretch min-h-screen min-w-full ;
      background-repeat: no-repeat;
      background-size: cover;
      backdrop-filter: blur(4px);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1002%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='url(%23SvgjsLinearGradient1003)'%3e%3c/rect%3e%3cpath d='M1440 0L765.12 0L1440 47.38z' fill='rgba(255%2c 255%2c 255%2c .1)'%3e%3c/path%3e%3cpath d='M765.12 0L1440 47.38L1440 153.02L445.97 0z' fill='rgba(255%2c 255%2c 255%2c .075)'%3e%3c/path%3e%3cpath d='M445.97 0L1440 153.02L1440 344.85L207.02000000000004 0z' fill='rgba(255%2c 255%2c 255%2c .05)'%3e%3c/path%3e%3cpath d='M207.01999999999998 0L1440 344.85L1440 429.57000000000005L148.24999999999997 0z' fill='rgba(255%2c 255%2c 255%2c .025)'%3e%3c/path%3e%3cpath d='M0 560L717.66 560L0 339.36z' fill='rgba(0%2c 0%2c 0%2c .1)'%3e%3c/path%3e%3cpath d='M0 339.36L717.66 560L1068.94 560L0 195.88000000000002z' fill='rgba(0%2c 0%2c 0%2c .075)'%3e%3c/path%3e%3cpath d='M0 195.88L1068.94 560L1175.02 560L0 99.63z' fill='rgba(0%2c 0%2c 0%2c .05)'%3e%3c/path%3e%3cpath d='M0 99.63L1175.02 560L1252.23 560L0 58.60999999999999z' fill='rgba(0%2c 0%2c 0%2c .025)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1002'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1003'%3e%3cstop stop-color='rgba(255%2c 255%2c 255%2c 1)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(40%2c 94%2c 97%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
    }

    .body {
        @apply flex flex-grow flex-wrap ml-0 justify-center w-1/2 items-start content-start
        pt-8 sm:pt-3 md:pt-4 lg:pt-4 overflow-hidden;
    }

    .app-description {
        @apply mt-16 sm:mt-20 sm:text-lg md:text-xl lg:text-xl xl:my-24 text-xl;
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
