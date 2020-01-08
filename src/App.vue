<template>
    <div id="app">
        <transition name="fade">
            <div class="preloader flex flex-col text-white text-4xl justify-center items-center" v-if="showPreloader">
                <div class="flex">
                    <img alt="" class="w-20 h-20" src="./assets/logo.svg"/>
                    <span class="text-primary self-center">Vitesse</span>
                </div>
                <div class="ml-8 lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div>
                </div>
            </div>
        </transition>
        <div v-if="!showPreloader">
            <Header/>
            <div class="container grid">
                <Calculator class="calculator "/>
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

    export default {
        name: 'app',
        components: {Prediction, Calculator, Settings, Footer, Header},
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
        background-color: white;
        position: absolute;
        z-index: 10;
        transition: all 5s;
    }

    .container {
        display: grid;
        align-content: start;
        grid-template-rows: repeat(3, auto);
        justify-content: center;
        grid-column-gap: 2vh;
        row-gap: 2vh;
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

    .footer {
        grid-row: 4 / 5;
        grid-column: 1 / 3;
        align-self: end;
        min-height: 300px;
    }

    .calculator {
        grid-column: 1 / 3;
        grid-row: 2 / 3;
    }

    .prediction {
        grid-column: 1 / 3;
        grid-row: 3 / 4;
    }

    .settings {
        grid-column: 2 / 3;
        grid-row: 3 / 4;

    }

    h2, h1, p {
        margin: 0;
    }

    .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }

    .lds-ellipsis div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: $ma-primary;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    .lds-ellipsis div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
    }

    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }

    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(24px, 0);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>
