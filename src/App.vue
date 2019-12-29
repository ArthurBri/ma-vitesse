<template>
    <div id="app">
        <Header/>
        <div class="container">
            <Calculator class="calculator"/>
            <Prediction class="prediction"/>
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

    // TODO : calculer par "pace"
    // TODO : limiter les minutes à 59, secondes à 59 si précédés
    // TODO : en cas de caractère non souhaité :
    // > au lieu d'effacer une partie de l'input, "annuler" le change (jouer avec OldVal / NewVal)
    // > faire "vibrer" l'input, en cas de 3 erreurs successives : pop up de suggestion
    // TODO : réglages : format de la vitesse, "." ou ",", langue dark-mode

    /* Fonctionnalités */
    // TODO : suggestion distance proche (marathon, semi-marathon...) à +- 5% de la distance entrée

    /* Prédictions */
    // TODO : estimation temps de course par ajustement pas rapport à une base

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
        color: #2C629D;
        min-width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .container {
        display: grid;
        align-content: start;
        grid-template-columns: repeat(2, 40vw);
        grid-template-rows: repeat(3, auto);
        justify-content: center;
        grid-column-gap: 2vh;
        row-gap: 2vh;
        overflow: auto;
        height: 80vh;
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
        height: 10vh;
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

    h2 {
        margin: 0;
    }

    h1 {
        margin: 0;
    }

    p {
        margin: 0;
    }
</style>
