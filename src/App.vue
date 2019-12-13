<template>
    <div id="app" class="container">
        <div class="header">
            <h1>Ma vitesse</h1>
        </div>
        <div class="main-box">
            <h2>Calculateur de vitesse, de durée, ou de distance</h2>
            <p>Remplir deux champs pour effectuer le calcul sur le 3ème champ</p>
            <div class="wrapper">
                <div :class="calculatedField === 'duration' ? 'calculated noselect-nodrag' : ''"
                     class="box duration">
                    <input :disabled="calculatedField === 'duration'" @keyup="checkFields" id="duration"
                           onblur="this.placeholder = 'Durée'" onfocus="this.placeholder = ''"
                           autocomplete="off" placeholder="Durée" v-model="duration"/>
                    <span>h</span>
                </div>
                <div class="subbox-distance">
                    <div :class="calculatedField === 'distance' ? 'calculated noselect-nodrag' : ''"
                         @click="showDistanceType = true"
                         class="box distance">
                        <input :disabled="calculatedField === 'distance'" @keyup="checkFields" name="distance"
                               onblur="this.placeholder = 'Distance'" onfocus="this.placeholder = ''"
                               autocomplete="off" placeholder="Distance" v-model="distance"/>
                        <span>km</span>
                    </div>
                        <label>
                            <select v-model="presetDistances" v-show="showDistanceType">
                                <option disabled value="">Distances officielles</option>
                                <option>Marathon</option>
                                <option>Semi-Marathon</option>
                                <option>10km</option>
                            </select>
                        </label>
                </div>
                <div :class="calculatedField === 'speed' ? 'calculated noselect-nodrag' : ''" class="box speed"
                     v-on:dblclick="changeSpeedFormat">
                    <input v-if="speedFormat === 'speed'" :disabled="calculatedField === 'speed'" @keyup="checkFields" name="speed"
                           onblur="this.placeholder = 'Vitesse'" onfocus="this.placeholder = ''"
                           autocomplete="off" placeholder="Vitesse" v-model="speed"/>
                    <input v-if="speedFormat === 'pace'" :disabled="calculatedField === 'pace'" @keyup="checkFields" name="speed"
                           onblur="this.placeholder = 'Rythme'" onfocus="this.placeholder = ''"
                           autocomplete="off" placeholder="Rythme" v-model="pace"/>
                    <span>{{ speedDisplayedFormat }}</span>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Footer from '@/components/Footer'
    // TODO : durée : possibilité d'écriture des formats en (XXhXXmXXs --> OK) ou XX:XX:XX
    // TODO : autoriser seulement deux ":" dans la durée, OU un "m", un "h", un "s"
    // TODO : afficher un icone pour les 3 champs, ou le nom du change en haut / au dessus de la box
    // TODO : calculer par "pace"
    // TODO : settings

    export default {
        name: 'app',
        components: {Footer},
        data() {
            return {
                duration: '',
                distance: '',
                presetDistances: '',
                showDistanceType: false,
                speed: '',
                pace: '',
                speedFormat: 'speed',
                speedDisplayedFormat: 'km/h',
                calculatedField: ''
            };
        },
        methods: {
            checkFields() {
                if (this.duration !== '' && this.distance !== '' && (this.speed === '' || this.calculatedField === 'speed')) {
                    this.calculatedField = 'speed';
                    this.speed = (this.formatDistance(this.distance) / this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '')
                } else if (this.distance !== '' && this.speed !== '' && (this.duration === '' || this.calculatedField === 'duration')) {
                    this.calculatedField = 'duration';
                    this.duration = this.prettyDuration((this.formatDistance(this.distance) / this.formatSpeed(this.speed))
                        .toFixed(3)
                        .replace(/\.?0+$/, ''));
                } else if (this.speed !== '' && this.duration !== '' && (this.distance === '' || this.calculatedField === 'distance')) {
                    this.calculatedField = 'distance';
                    this.distance = (this.formatSpeed(this.speed) * this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '')
                } else {
                    this.calculatedField = ''
                }
            },
            formatSpeed(speed) {
                speed = speed.replace(',', '.');
                return speed

            },
            formatDistance(distance) {
                distance = distance.replace(',', '.');
                return distance
            },
            formatDuration: function (duration) {
                if (/^\d+$/.test(duration)) {
                    return duration
                } else {
                    let hours = duration.match(/(\d+h)*/g).join('').replace('h', '') || 0;
                    let minutes = duration.match(/(\d+m)*/g).join('').replace('m', '') || duration.match(/(h\d{2})*(?!s)/g).join('').replace('h', '') || 0;
                    let seconds = duration.match(/(\d+s)*/g).join('').replace('s', '') || duration.match(/(m\d*)*/g).join('').replace('m', '') || 0;
                    return parseFloat(hours) + (parseFloat(minutes) / 60) + (parseFloat(seconds) / 3600)

                }
            },
            prettyDuration: function (duration) {
                let hours = duration | 0;
                let minutes = ((duration % 1) * 60) | 0;
                let seconds = ((((duration % 1) * 60) % 1) * 60) | 0;

                let prettyDuration = '';
                if (hours !== 0) {
                    prettyDuration += (hours + 'h')
                }
                if (minutes !== 0) {
                    prettyDuration += (minutes + 'm')
                }
                if (seconds !== 0) {
                    prettyDuration += (seconds + 's')
                }
                return prettyDuration
            },
            changeSpeedFormat: function () {
                if (this.calculatedField === 'speed') {
                    if (this.speedFormat === 'speed') {
                        this.speedFormat = 'pace';
                        this.speedDisplayedFormat = 'min/km';
                    } else {
                        this.speedFormat = 'speed';
                        this.speedDisplayedFormat = 'km/h';
                    }
                }
            }
        },
        watch: {
            duration: function () {
                if (this.duration === '') {
                    if (this.calculatedField === 'speed') {
                        this.speed = ''
                        this.pace = ''
                    } else if (this.calculatedField === 'distance') {
                        this.distance = ''
                    }
                } else if (this.calculatedField !== 'duration') {
                    this.duration = this.duration.replace(/[^0-9:,.hms]+/g, '')
                }
            },
            distance: function () {
                if (this.distance === '') {
                    if (this.calculatedField === 'speed') {
                        this.speed = ''
                        this.pace = ''
                    } else if (this.calculatedField === 'duration') {
                        this.duration = ''
                    }
                } else if (this.calculatedField !== 'distance') {
                    this.distance = this.distance.replace(/[^0-9.,]+/g, '');
                    this.checkFields()
                }
            },
            speed: function () {
                if (this.speed === '') {
                    if (this.calculatedField === 'duration') {
                        this.duration = ''
                    } else if (this.calculatedField === 'distance') {
                        this.distance = ''
                    }
                } else if (this.calculatedField !== 'speed') {
                    this.speed = this.speed.match(/\d+([.|,]\d{0,4})?/g)[0];
                } else if (this.calculatedField === 'speed') {
                    let speedToPace = this.speed.replace('km/h', '');
                    let minutes = ((1 / speedToPace) * 60) | 0;
                    let seconds = (((1 / speedToPace) * 60) % 1) * 60 | 0;
                    this.pace = minutes + ':' + seconds
                }
            },
            presetDistances: function () {
                if (this.calculatedField !== 'distance') {
                    switch (this.presetDistances) {
                        case 'Marathon':
                            this.distance = "42,195";
                            break;
                        case 'Semi-Marathon' :
                            this.distance = "21.0975";
                            break;
                        case '10km' :
                            this.distance = "10";
                            break;
                    }
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
        color: #2C629D;
        min-width: 100%;
        overflow-x: hidden;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .main-box {
        background: #2C629D;
        color: white;
        margin: 0 auto 0 auto;
        width: 80vw;
        min-height: 50vh;
        border-radius: 15px;
        padding: 3vh 3vw 3vh 3vw;
    }

    @media screen and (max-width: 950px) {
        .wrapper {
            display: flex;
            flex-flow: column wrap;
            justify-content: space-between;

        }
    }

    @media screen and (min-width: 951px) {
        .wrapper {
            display: flex;
            flex-flow: row wrap;
            align-items: stretch;
            align-content: center;
            justify-content: center;

        }
    }

    .box {
        border-radius: 7px;
        height: 10vh;
        box-shadow: 0 0 10px rgba(33, 33, 33, .2);
        background-color: white;
        margin: 2vh 1vw 2vh 1vw;
        padding: 1vh 1vw 1vh 1vw;
        color: #2C629D;
        font-size: 1.3em;
        transition: box-shadow .1s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .box:hover(:not(calculated)) {
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    }

    .footer {
        height: 5vh;
        margin-top: auto;
        text-align: center;
    }

    img {
        width: 30px;
        align-self: flex-start;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .duration {
        order: 1;
    }

    .subbox-distance {
        order: 2;
        text-align: center;
    }

    .speed {
        order: 3;
    }

    .calculated {
        box-shadow: 0 8px 15px darkolivegreen, 0 6px 6px rgba(0, 0, 0, 0.23);
        background-color: lightgreen;
        animation: scale-up 0.2s forwards, scale-out 0.5s;
        font-size:1.4em;
        color:white;
    }

    input {
        background-color: rgba(0, 0, 0, 0.0);
        font-size: 1em;
        text-align: right;
        padding-right: 2vw;
        border: none;
    }

    input:focus {
        outline: none;
    }

    select {
        background-color: rgba(0, 0, 0, 0.0);
        border: none;

        font-size: 1em;
        color: white;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';

        > option {
            color: #2C629D;
            text-align: center;
        }
    }

    select:focus {
        outline: none;
    }

    .noselect-nodrag {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
                                       supported by Chrome, Opera and Firefox */
        // NO DRAG
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
    }

    h1 {
        font-size: 2.5em;
        text-align: center;
    }

    @keyframes scale-up {
        from { transform: scale(1.0); }
        to { transform: scale(1.1);}
    }

    @keyframes scale-down {
        from { transform: scale(1.1); }
        to { transform: scale(1.0);}
    }
</style>
