<template>
    <div id="app">
        <h1>Ma vitesse</h1>
        <h2>Calculateur de vitesse, d'estimations de course...</h2>
        <p>Remplir deux champs pour effectuer le calcul sur le 3ème champ.</p>
        <div class="wrapper">
            <div class="box duration" :class="calculatedField === 'duration' ? 'calculated' : ''">
                <label for="duration">Durée</label><input v-model="duration" id="duration" placeholder="Durée"
                                                     @keyup="checkFields" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Durée'"
                                                     :disabled="calculatedField === 'duration'"/>
            </div>
            <div class="box distance" :class="calculatedField === 'distance' ? 'calculated' : ''">
                <label>
                    <input v-model="distance" name="distance" placeholder="Distance"
                           @keyup="checkFields" onfocus="this.placeholder = '';" @focus="showDistanceType = true" @blur="showDistanceType = false" onblur="this.placeholder = 'Distance'"
                           :disabled="calculatedField === 'distance'"/>
                </label>
                <span v-show="showDistanceType">Sélectionné :</span>
                <label>
                    <select v-model="distanceType" v-show="showDistanceType">
                        <option disabled value="">Choisissez</option>
                        <option>Marathon</option>
                        <option>Semi-Marathon</option>
                        <option>10km</option>
                    </select>
                </label>

            </div>
            <div class="box speed" :class="calculatedField === 'speed' ? 'calculated' : ''">
                <label>
                    <input v-model="speed" name="speed" placeholder="Vitesse"
                           @keyup="checkFields" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Vitesse'"
                           :disabled="calculatedField === 'speed'"/>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    // TODO : durée : possibilité d'écriture des formats en (XXhXXmXXs --> OK) ou XX:XX:XX
    // TODO : analyser le paste
    // TODO : autoriser deux ":" dans la durée, OU un "m", un "h", un "s"
    // TODO : clic sur vitesse calculé : affichage du rythme (pace)
    // TODO : afficher un icone pour les 3 champs, ou le nom du change en haut / au dessus de la box
    export default {
        name: 'app',
        data () {
            return {
                duration: '',
                distance: '',
                distanceType: '',
                showDistanceType: false,
                speed: '',
                calculatedField: ''
            };
            },
        methods: {
            checkFields () {
                // eslint-disable-next-line no-console
                if (this.duration !== '' && this.distance !== '' && (this.speed === '' || this.calculatedField === 'speed')){
                    this.calculatedField = 'speed';
                    this.speed = (this.formatDistance(this.distance) / this.formatDuration(this.duration))
                                .toFixed(3)
                                .replace(/\.?0+$/, '') + " km/h"
                } else if (this.distance !== '' && this.speed !== '' && (this.duration === '' || this.calculatedField === 'duration')){
                    this.calculatedField = 'duration';
                    this.duration = this.prettyDuration((this.formatDistance(this.distance) / this.formatSpeed(this.speed))
                                    .toFixed(3)
                                    .replace(/\.?0+$/, ''));
                } else if (this.speed !== '' && this.duration !== '' && (this.distance === '' || this.calculatedField === 'distance')){
                    this.calculatedField = 'distance';
                    this.distance = (this.formatSpeed(this.speed) * this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '') + " km"
                } else { this.calculatedField = '' }
            },
            formatSpeed (speed) {
                speed = speed.replace(',','.');
                return speed

            },
            formatDistance (distance) {
                distance = distance.replace(',','.');
                return distance
            },
            formatDuration: function (duration) {
                let hours = duration.match(/(\d+h)*/g).join('').replace('h','') || 0;
                // eslint-disable-next-line no-console
                console.log('h:' + hours);
                let minutes = duration.match(/(\d+m)*/g).join('').replace('m','') || duration.match(/(h\d*)*/g).join('').replace('h','');
                // eslint-disable-next-line no-console
                console.log('m2:' + duration.match(/(h\d*)*/g));
                // eslint-disable-next-line no-console
                console.log('m:' + minutes);
                let seconds = duration.match(/(\d+s)*/g).join('').replace('s','') || 0;
                // eslint-disable-next-line no-console
                console.log('s:' + seconds);
                let formattedDuration = parseFloat(hours) + (parseFloat(minutes) / 60) + (parseFloat(seconds) / 3600);
                // eslint-disable-next-line no-console
                console.log(formattedDuration);
                return formattedDuration

            },
            prettyDuration: function(duration) {
                let hours = duration | 0;
                let minutes = ((duration % 1) * 60) | 0;
                let seconds = ((((duration % 1) * 60) % 1 ) * 60) | 0;

                let prettyDuration = '';
                if (hours !== 0) { prettyDuration += (hours + 'h') }
                if (minutes !== 0) { prettyDuration += (minutes + 'm') }
                if (seconds !== 0) { prettyDuration += (seconds + 's') }
                return prettyDuration
            }
        },
        watch: {
            duration: function () {
                if (this.duration === '') {
                    if (this.calculatedField === 'speed') { this.speed = '' }
                    else if (this.calculatedField === 'distance') { this.distance = ''}
                } else if (this.calculatedField !== 'duration') {
                    this.duration = this.duration.replace(/[^0-9:,.hms]+/g, '')
                }
            },
            distance: function () {
                if (this.distance === '') {
                    if (this.calculatedField === 'speed') { this.speed = '' }
                    else if (this.calculatedField === 'duration') { this.duration = ''}
                } else if (this.calculatedField !== 'distance'){
                    this.distance = this.distance.replace(/[^0-9.,]+/g, '')
                }
            },
            speed: function () {
                if (this.speed === '') {
                    if (this.calculatedField === 'duration') { this.duration = '' }
                    else if (this.calculatedField === 'distance') { this.distance = ''}
                } else if (this.calculatedField !== 'speed') {
                    this.speed = this.speed.replace(/[^0-9:,.]+/g,'')
                }
            },
            distanceType: function () {
                if (this.calculatedField !== 'distance') {
                    switch (this.distanceType) {
                        case 'Marathon':
                            this.distance = "42,195"; break;
                        case 'Semi-Marathon' :
                            this.distance = "21.0975"; break;
                        case '10km' :
                            this.distance = "10"; break;

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
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
        grid-auto-rows: minmax(100px, auto);
        margin: 0 auto;
    }

    .box {
        border-radius : 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        border: 3px solid #ECBE7A;
        color: #ECBE7A;
    }
    .duration {
        grid-column: 1 / 1;
    }
    .distance {
        grid-column: 2 / 3;
    }
    .speed {
        grid-column: 3 / 3;
    }

    .calculated {
        border: 3px solid #70AE98;
        background-color: #70AE98;

        & input::placeholder {
            color: white;
        }
    }

    input {
        background-color: rgba(0, 0, 0, 0.0);
        height:100px;
        font-size:40px;
        text-align:center;
        border:none;
    }

    input::placeholder {
        color: gray;
    }

    input:focus {
        outline: none;
    }
</style>
