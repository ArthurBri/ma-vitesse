<template>
    <div>
        <preloader v-if="showPreloader"/>
        <div class="bg-gray-200 background"></div>
        <div id="app" v-if="!showPreloader">
            <Header/>
            <h1 class="text-white text-center text-3xl ml-10 mr-10 xs:text-lg xs:m-4 xs:mb-0 sm:text-xl sm:m-3 sm:mb-0 md:text-xl md:mt-2 lg:text-2xl">
                <b>MA Vitesse</b> : outil de calcul pour la course à pied</h1>
            <div class="body pt-8 xs:pt-2 sm:pt-3 md:pt-4 lg:pt-4">
                <Calculator class="mt-12"/>
                <div class="w-4/5 flex">
                    <transition name="fade">
                        <div class="tabs-menu w-1/2 mt-5 xs:w-full sm:w-full">
                            <div class="tabs-content xs:ml-0 xs:mr-0 sm:mr-0 sm:ml-0 border-gray-600 xs:w-full sm:w-full
                                xl:rounded-b-lg lg:rounded-b-lg md:rounded-b-lg xl:rounded-r-lg lg:rounded-r-lg md:rounded-r-lg"
                                 v-if="showTabMenu">
                                <span @click="hideTabActive"
                                      class="self-end mr-3 mt-3 bg-primary hover:bg-gray-500 cursor-pointer rounded-lg p-2 pt-1 pb-1 text-xs text-white">Masquer</span>
                                <div class="p-6">
                                    <Prediction v-show="showPredictions && tabActive === 'predictions'"/>
                                    <LapTime v-show="showLapTime && tabActive === 'laptime'"></LapTime>
                                </div>
                            </div>
                            <div class="tabs flex overflow-x-auto">
                                <TabMenuItem :active="tabActive === 'predictions'" :hidden="!showPredictions"
                                             @click.native="setTabActive('predictions')"
                                             component="predictions" label="Prédictions de course" version="Alpha"/>
                                <TabMenuItem :active="tabActive === 'laptime'" :hidden="!showLapTime"
                                             @click.native="setTabActive('laptime')"
                                             component="laptime" label="Temps de passage" version="A venir"/>
                            </div>
                        </div>
                        <!-- FIN TABS -->
                    </transition>
                    <div class="share-box w-1/3 ml-8 mt-5 xs:w-full sm:w-full h-20">
                        <h1>Partager</h1>
                    </div>
                </div>
            </div>
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

    export default {
        name: 'app',
        components: {Prediction, Calculator, LapTime, Settings, Header, Preloader, TabMenuItem},
        data() {
            return {
                showPreloader: true,
                tabActive: ''
            }
        },
        mounted() {
            setTimeout(() => {
                this.showPreloader = false;
            }, 800);
            this.tabActive = this.showPredictions ? 'predictions' : this.showLapTime ? 'laptime' : ''
        },
        computed: {
            showPredictions: {
                get: function () {
                    return this.$store.state.showPredictions
                }, set: function (newVal) {
                    this.$store.commit('showPredictions', newVal)
                }
            },
            showLapTime: {
                get: function () {
                    return this.$store.state.showLapTime
                }, set: function (newVal) {
                    this.$store.commit('showLapTime', newVal)
                }
            },
            showTabMenu: function () {
                return this.showPredictions || this.showLapTime
            }
        },
        watch: {
            showPredictions: function () {
                this.tabActive = this.showPredictions ? 'predictions' : 'laptime'
            },
            showLapTime: function () {
                this.tabActive = this.showLapTime ? 'laptime' : 'predictions'
            }
        },
        methods: {
            setTabActive: function (tabToActivate) {
                this.tabActive = tabToActivate
            },
            hideTabActive: function () {
                if (this.tabActive === 'predictions') {
                    this.showPredictions = false;
                    this.tabActive = 'laptime'
                } else if (this.tabActive === 'laptime') {
                    this.showLapTime = false;
                    this.tabActive = 'predictions'

                }
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

    }

    .background {
        background: url('../src/assets/wallpp3.jpg');
        background-size: cover;
        z-index: -999;
        position: fixed;
        width: 100vw;
        top: 0;
        height: 100vh;
    }

    .body {
        @apply flex flex-grow flex-wrap ml-0 mb-8 justify-center overflow-auto w-5/6 items-start content-start ;
    }

    @screen xs {
        .body {
            @apply w-full;
        }
    }

    @screen sm {
        .body {
            @apply w-full;
        }
    }

    h2, h1, p {
        margin: 0;
    }

    .tab {
        cursor: pointer;

        > span {
            cursor: pointer;
        }
    }

    .prediction-icon {
        background-image: url("assets/icons/predictions.svg");
        background-size: cover;
        transition: all 200ms;

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                background-image: url('./assets/icons/cancel.svg');
                transform: scale(0.6)
            }
        }
    }

    .laptime-icon {
        background-image: url("./assets/icons/laptime.svg");
        background-size: cover;
        transition: all 200ms;

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                background-image: url('./assets/icons/cancel.svg');
                transform: scale(0.6)
            }
        }
    }

    .tabs-content {
        @apply flex flex-col;
        @apply rounded-lg shadow-xl;
        background-color: rgba($ma-primary, 0.8);
        backdrop-filter: blur(2px);
    }

    .share-box {
        @apply flex flex-col;
        @apply rounded-lg shadow-xl;
        background-color: rgba(white, 0.8);
        backdrop-filter: blur(2px);
    }
</style>
