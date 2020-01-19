<template>
    <div class="bg-gray-200">
        <preloader v-if="showPreloader"/>
        <div id="app" v-if="!showPreloader">
            <Header/>
            <div class="body">
                <Calculator class="calculator mb-6"/>
                <transition name="fade">
                    <Prediction v-show="showPredictions"/>
                </transition>
                <Settings class="settings" v-if="1 === 2 "/>
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
    import Settings from '@/components/Settings'
    import Preloader from '@/components/Preloader'

    export default {
        name: 'app',
        components: {Prediction, Calculator, Settings, Footer, Header, Preloader},
        data() {
            return {
                showPreloader: true,
                showPredictions: false
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
</style>
