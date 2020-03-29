<template>
    <div>
        <preloader v-if="showPreloader"/>
        <div class="bg-gray-200 background"></div>
        <div id="app" v-if="!showPreloader">
            <Header/>
            <h1 class="text-white leading-tight flex flex-col text-center text-3xl ml-10 mr-10 xs:text-lg xs:m-4 xs:mb-0 sm:text-xl sm:m-3 sm:mb-0 md:text-xl md:mt-2 lg:text-2xl">
                <span><b>MA Vitesse</b></span>
                <span>Assistant d'entraînement pour course à pied</span>
            </h1>
            <div class="body pt-8 xs:pt-2 sm:pt-3 md:pt-4 lg:pt-4 overflow-hidden">
                <Calculator class="mt-12"/>
                <div class="w-full flex xs:flex-col sm:flex-col md:flex-col justify-center">
                    <transition name="fade">
                        <div class="tabs-menu w-3/4 mt-5 xs:mt-0 xs:w-full sm:w-full md:w-full" v-if="showTabMenu">
                            <div class="tabs flex flex-col xs:flex-row md:flex-row xs:overflow-x-auto overflow-x-auto xl:h-24">
                                <TabMenuItem :active="tabActive === 'laptime'" :hidden="!showLapTime"
                                             @click.native="setTabActive('laptime')"
                                             component="laptime" label="Temps de passage"/>
                                <TabMenuItem :active="tabActive === 'predictions'" :hidden="!showPredictions"
                                             @click.native="setTabActive('predictions')"
                                             component="predictions" label="Prédictions de course"/>
                            </div>
                            <div class="tabs-content xs:ml-0 xs:mr-0 sm:mr-0 sm:ml-0 xs:w-full sm:w-full
                                lg:rounded-b-lg md:rounded-b-lg rounded-r-lg sm:rounded-r-none xs:rounded-none w-full justify-center"
                                 v-if="showTabMenu">
                                <div class="p-6">
                                    <LapTime v-show="showLapTime && tabActive === 'laptime'"></LapTime>
                                    <Prediction v-show="showPredictions && tabActive === 'predictions'"/>
                                </div>
                            </div>
                        </div>
                        <!-- FIN TABS -->
                    </transition>
                    <Share/>
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
    import Share from '@/components/Share'

    export default {
        name: 'app',
        components: {Prediction, Calculator, LapTime, Settings, Header, Preloader, TabMenuItem, Share},
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
            this.tabActive = this.showLapTime ? 'laptime' : this.showPredictions ? 'predictions' : ''
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
        background: url('assets/wallpp.jpg');
        background-size: cover;
        z-index: -999;
        position: fixed;
        width: 100vw;
        top: 0;
        height: 100vh;
    }

    .body {
        @apply flex flex-grow flex-wrap ml-0 mb-8 justify-center overflow-auto w-4/6 items-start content-start ;
    }

    @screen xs {
        .body {
            @apply w-full mb-0;
        }
    }

    @screen sm {
        .body {
            @apply w-full m-0;
        }

        .tabs-content {
            @apply rounded-r-none;
        }
    }

    @screen md {
        .tabs-menu {
            @apply flex-col;
        }
    }

    @screen lg {
        .body {
            @apply w-5/6;
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
        @apply flex flex-col text-white;
        @apply rounded-b-lg shadow-xl;
        background-color: rgba($ma-primary, 0.8);
        backdrop-filter: blur(2px);
    }

    .tabs-menu {
        @apply flex;
    }

    @screen xs {
        .tabs-menu {
            @apply flex-col;
        }

        .tabs-content {
            @apply rounded-none rounded-r-none;
        }
    }
</style>
