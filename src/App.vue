<template>
    <div id="app" class="container">
        <div class="header">
            <h1>Ma vitesse</h1>
            <h2>Calculateur de vitesse, d'estimations de course</h2>
            <p>Remplir deux champs pour effectuer le calcul sur le 3ème champ</p>
        </div>
        <div class="wrapper">
            <div class="box duration" :class="calculatedField === 'duration' ? 'calculated noselect-nodrag' : ''">
                <input v-model="duration" id="duration" placeholder="Durée"
                       @keyup="checkFields" onfocus="this.placeholder = ''"
                       onblur="this.placeholder = 'Durée'"
                       :disabled="calculatedField === 'duration'"/>
                <img title="Durée" src="./assets/icons/clock.svg"/>
            </div>
            <div class="box distance" :class="calculatedField === 'distance' ? 'calculated noselect-nodrag' : ''"
                 @click="showDistanceType = true">
                <input v-model="distance" name="distance" placeholder="Distance"
                       @keyup="checkFields" onfocus="this.placeholder = ''"
                       onblur="this.placeholder = 'Distance'"
                       :disabled="calculatedField === 'distance'"/>
                <img title="Distance" class="noselect-nodrag" src="./assets/icons/ruler.svg"
                     alt="distance"/>
                <div class="preset">
                    <span v-if="showDistanceType === true && calculatedField !== 'speed'">Distances officielles :</span>
                    <label>
                        <select v-model="presetDistances" v-show="showDistanceType">
                            <option disabled value="">Choisissez</option>
                            <option>Marathon</option>
                            <option>Semi-Marathon</option>
                            <option>10km</option>
                        </select>
                    </label>
                </div>
            </div>
            <div v-if="speedFormat === 'speed'" class="box speed"
                 :class="calculatedField === 'speed' ? 'calculated noselect-nodrag' : ''"
                 v-on:dblclick="changeSpeedFormat">
                <input v-model="speed" name="speed" placeholder="Vitesse"
                       @keyup="checkFields" onfocus="this.placeholder = ''"
                       onblur="this.placeholder = 'Vitesse'"
                       :disabled="calculatedField === 'speed'"/>
                <img title="Vitesse" class="noselect-nodrag" src="./assets/icons/flash_on.svg"/>
            </div>
            <div v-if="speedFormat === 'pace'" class="box speed"
                 :class="calculatedField === 'speed' ? 'calculated noselect-nodrag' : ''"
                 v-on:dblclick="changeSpeedFormat">
                <input v-model="pace" name="speed" placeholder="Rythme"
                       @keyup="checkFields" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Rythme'"
                       :disabled="calculatedField === 'pace'"/>
                <img title="Vitesse" class="noselect-nodrag" src="./assets/icons/flash_on.svg" width="40px"/>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Footer from '@/components/Footer'
    // TODO : durée : possibilité d'écriture des formats en (XXhXXmXXs --> OK) ou XX:XX:XX
    // TODO : autoriser seulement deux ":" dans la durée, OU un "m", un "h", un "s"
    // TODO : fixer affichage des distance officielles
    // TODO : placer l'affichage des distances officielles en dessous
    // TODO : afficher un icone pour les 3 champs, ou le nom du change en haut / au dessus de la box
    // TODO : remove autocomplete des champs

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
                calculatedField: ''
            };
        },
        methods: {
            checkFields() {
                if (this.duration !== '' && this.distance !== '' && (this.speed === '' || this.calculatedField === 'speed')) {
                    this.calculatedField = 'speed';
                    this.speed = (this.formatDistance(this.distance) / this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '') + " km/h"
                } else if (this.distance !== '' && this.speed !== '' && (this.duration === '' || this.calculatedField === 'duration')) {
                    this.calculatedField = 'duration';
                    this.duration = this.prettyDuration((this.formatDistance(this.distance) / this.formatSpeed(this.speed))
                        .toFixed(3)
                        .replace(/\.?0+$/, ''));
                } else if (this.speed !== '' && this.duration !== '' && (this.distance === '' || this.calculatedField === 'distance')) {
                    this.calculatedField = 'distance';
                    this.distance = (this.formatSpeed(this.speed) * this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '') + " km"
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
                    } else {
                        this.speedFormat = 'speed';
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
                    this.pace = minutes + ':' + seconds + ' min/km'
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
        color: darkslategrey;
        height: 100vh;
    }

    .container {
        display: flex;
        width: 100vw;
        flex-direction: column;
    }

    .header {
        padding: 0 5vw 0 5vw;
    }
    .wrapper {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;

    }

    .box {
        border-radius: 7px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
        border: 3px solid #ECBE7A;
        margin: 2vh 5vw 2vh 5vw;
        padding: 1vh 1vw 1vh 1vw;
        color: #ECBE7A;
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

    .distance {
        order: 2;
    }

    .speed {
        order: 3;
    }

    .calculated {
        border: 5px solid #70AE98;
        color: #70AE98;

        + input {
            @extend .noselect-nodrag;
        }
    }

    input {
        background-color: rgba(0, 0, 0, 0.0);
        font-size: 20px;
        text-align: center;
        border: none;
    }

    input::placeholder {
        color: gray;
    }

    input:focus {
        outline: none;
    }

    .preset {
        flex-direction: column;
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
</style>
