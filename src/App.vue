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
                <transition name="fade">
                    <!-- TABS DES FONCTIONS ADDITIONNELLES : A COMPOSANTISER -->
                    <div class="tabs-menu w-2/3 mt-5 xs:w-full sm:w-full ">
                        <div class="tabs flex">
                            <div :class="[tabSelected === 'predictions' ? '' : 'border bg-gray-300 pb-1']"
                                 @click="tabSelected = 'predictions'"
                                 class="tab bg-white text-primary pt-2 pl-2 pr-2 rounded-t-lg border-t border-l border-primary"
                                 v-show="showPredictions">
                                <div class="flex h-8 mt-1 ml-1 mr-1">
                                    <div @click="showPredictions = false" class="prediction-icon w-8"></div>
                                    <h2 class="noselect-nodrag self-center pl-2 text-primary font-semibold cursor-pointer">
                                        Prédictions de course</h2>
                                    <span class="self-top text-xxs border border-secondary text-primary inline rounded-full h-3 ml-1 pl-1 pr-1">Alpha</span>

                                </div>
                            </div>
                            <div :class="[tabSelected === 'laptime' ? '' : 'border bg-gray-300 pb-1']"
                                 @click="tabSelected = 'laptime'" class="tab flex bg-white text-primary pt-2 pl-2 pr-2 rounded-t-lg border-t
                             border-l border-primary" v-show="showLapTime">
                                <div class="flex h-8 mt-1 ml-1 mr-1">

                                    <div @click="showLapTime = false" class="laptime-icon w-8"></div>
                                    <h2 class="noselect-nodrag self-center pl-2 text-primary font-semibold cursor-pointer">
                                        Temps de passage</h2>
                                    <span class="self-top text-xxs border border-secondary text-primary inline rounded-full h-3 ml-1 pl-1 pr-1">A venir</span>
                                </div>
                            </div>
                        </div>
                        <div class="tabs-content p-6 xs:ml-0 xs:mr-0 sm:mr-0 sm:ml-0 border-gray-600 xs:w-full sm:w-full bg-white border-l border-b border-r
                            rounded-b-lg rounded-r-lg">
                            <Prediction v-show="showPredictions && tabSelected === 'predictions'"/>
                            <LapTime v-show="showLapTime && tabSelected === 'laptime'"></LapTime>
                        </div>
                    </div>
                    <!-- FIN TABS -->
                </transition>
            </div>
            <Footer/>
        </div>
    </div>
</template>

<script>
    import Header from '@/components/Header'
    import Footer from '@/components/Footer'
    import Calculator from '@/components/Calculator'
    import Prediction from '@/components/Prediction'
    import LapTime from '@/components/LapTime'
    import Settings from '@/components/Settings'
    import Preloader from '@/components/Preloader'

    export default {
        name: 'app',
        components: {Prediction, Calculator, LapTime, Settings, Footer, Header, Preloader},
        data() {
            return {
                showPreloader: true,
                showPredictions: false,
                showLapTime: true,
                tabSelected: 'predictions'
            }
        },
        mounted() {
            setTimeout(() => {
                this.showPreloader = false;
            }, 800);
            this.showPredictions = this.getPredictionsPreference
        },
        computed: {
            getPredictionsPreference: function () {
                return this.$store.state.showPredictions
            }
        },
        watch: {
            getPredictionsPreference: function () {
                this.showPredictions = this.getPredictionsPreference
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
        background: url('../src/assets/wallpp.jpg');
        background-size: cover;
        z-index: -999;
        position: fixed;
        width: 100vw;
        top: 0;
        height: 100vh;
    }

    .body {
        @apply flex flex-grow flex-wrap ml-0 justify-center overflow-auto w-5/6 items-start content-start ;
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
        background-image: url("./assets/icons/prediction.svg");
        background-size: cover;
        transition: all 200ms;

        &:hover {
            background-image: url('./assets/icons/cancel.svg');
            transform: scale(0.6)
        }
    }

    .laptime-icon {
        background-image: url("./assets/icons/laptime.svg");
        background-size: cover;
        transition: all 200ms;

        &:hover {
            background-image: url('./assets/icons/cancel.svg');
            transform: scale(0.6)
        }
    }
</style>
