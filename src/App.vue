<template>
    <div class="bg-gray-200" id="app">
        <preloader v-if="showPreloader"/>
        <div v-if="!showPreloader">
            <Header/>
            <div class="container flex justify-center flex-wrap xl:justify-start">
                <Calculator class="calculator mb-6 "/>
                <transition name="fade">
                    <Prediction @close="showPredictions = false" class="prediction" v-if="showPredictions"/>
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
                showPredictions: true
            }
        },
        mounted() {
            setTimeout(() => {
                this.showPreloader = false;
            }, 800)
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: $ma-primary;
        min-width: 100%;
        height: 100vh;
        overflow: hidden;
        z-index: 0;
        position: relative;
    }

    .preloader {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 10;
        transition: all 5s;
        @apply bg-gray-200;
    }

    .container {
        display: grid;
        align-content: start;
        grid-template-rows: repeat(3, auto);
        justify-content: center;
        grid-column-gap: 2vh;
        margin: auto;
        height: 80vh;
        overflow: auto;
    }

    .header {
        display: flex;
        align-items: center;
        grid-column: 1 / 3;
        grid-row: 1 / 2;
        height: 10vh;
    }

    h2, h1, p {
        margin: 0;
    }
</style>
