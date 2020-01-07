<template>
    <div id="app">
        <Header/>
        <div class="container grid">
            <Calculator class="calculator "/>
            <Prediction class="prediction "/>
            <Settings class="settings" v-if="1 === 2 "/>
        </div>
        <Footer/>
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
            return {}
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
        grid-column: 1 / 2;
        grid-row: 3 / 4;
    }

    .settings {
        grid-column: 2 / 3;
        grid-row: 3 / 4;

    }

    h2, h1, p {
        margin: 0;
    }
</style>
