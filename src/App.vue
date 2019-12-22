<template>
    <div id="app" class="container">
        <div class="header noselect-nodrag">
            <img alt="" src="./assets/logo.svg" width="100"/>
            <h1 style="margin-left:10px;">Vitesse</h1>
        </div>
        <Calculator/>
        <!--<div class="main-box">
            <div class="main-box predictions">
                <h2 class="noselect-nodrag" v-if="calculatedField===''">Prédictions de course</h2>
                <span>Estimation de performance à partir des données du calculateur</span>
            </div>
            <div class="main-box settings">
                <spans>Paramètres</spans>
            </div>
        </div>
            <Settings/>-->
        <Footer/>
    </div>
</template>

<script>
    import Footer from '@/components/Footer'
    import Calculator from '@/components/Calculator'
    // TODO : calculer par "pace"
    // TODO : limiter les minutes à 59, secondes à 59 si précédés
    // TODO : réglages : format de la vitesse, "." ou ",", langue dark-mode

    /* Fonctionnalités */
    // TODO : suggestion distance proche (marathon, semi-marathon...) à +- 5% de la distance entrée
    // TODO : estimation temps de course par ajustement pas rapport à une base

    export default {
        name: 'app',
        components: {Calculator, Footer},
        data() {
            return {
                /* duration */
                duration: '',
                durationDisplayed: '',
                durationDisplayedFormat: 'h',
                /* distance */
                distance: '',
                presetDistances: '',
                showPresetDistances: false,
                /* speed */
                speed: '',
                pace: '',
                speedFormat: 'speed',
                speedDisplayedFormat: 'km/h',
                calculatedField: '',
                prettyCalculatedField: ''
            };
        },
        methods: {}
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2C629D;
        min-width: 100%;
        overflow-x: hidden;
        height: 95vh;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .header {
        padding: 3vh 3vw 3vh 1vw;
        margin: 0 auto 0 auto;
        width: 75vw;
        display: flex;
        height: 80px;
        align-items: center;
    }
</style>
