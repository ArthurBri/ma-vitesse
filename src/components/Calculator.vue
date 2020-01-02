<template>
    <div class="main-box">
        <h2 class="noselect-nodrag" v-if="calculatedField===''">Calculateur de vitesse, de durée, de distance</h2>
        <div class="noselect-nodrag" style="display:flex" v-else>
            <h2>Calcul de la <span class="calculated-label">{{ prettyCalculatedField }}</span></h2>
            <span><img @click="clearFields()" alt="clear field button" class="clear-fields-button"
                       src="../assets/icons/cancel.svg"/></span>
        </div>
        <div class="wrapper">
            <div class="subbox-distance noselect-nodrag">
                <div :class="calculatedField === 'duration' ? 'calculated noselect-nodrag' : ''"
                     @click="focusMe('duration')" class="box duration">
                    <label for="duration">Durée</label>

                    <div class="one-field-mode" v-if="oneFieldMode === true">
                        <input :disabled="calculatedField === 'duration'" @focus="showPresetDistances = false"
                               @keyup="checkFields"
                               autocomplete="off" id="duration" ref="duration"
                               tabindex="1" v-model="duration"/>
                        <span class="noselect-nodrag">{{ durationDisplayedFormat }}</span>
                    </div>
                    <div class="three-fields-mode" v-if="oneFieldMode === false">
                        <label>
                            <input :disabled="calculatedField === 'duration'" @focus="showPresetDistances = false"
                                   @keyup="checkFields" autocomplete="off" placeholder="hh"
                                   style="width:20px;text-align:center;padding-right: 5px;" tabindex="1"
                                   v-model="durationHours"/>
                            <span class="noselect-nodrag">:</span>
                            <input :disabled="calculatedField === 'duration'" @focus="showPresetDistances = false"
                                   @keyup="checkFields" autocomplete="off" placeholder="mm"
                                   style="width:20px;text-align:center;padding-right: 5px;" tabindex="1"
                                   v-model="durationMinutes"/>
                            <span class="noselect-nodrag">:</span>
                            <input :disabled="calculatedField === 'duration'" @focus="showPresetDistances = false"
                                   @keyup="checkFields" autocomplete="off" placeholder="ss"
                                   style="width:20px;text-align:center;padding-right: 5px;" tabindex="1"
                                   v-model="durationSeconds"/>
                        </label>
                    </div>
                </div>
                <div @click="oneFieldMode = !oneFieldMode" class="duration-display-switch">
                    <svg v-bind:class="[oneFieldMode ? 'dot' : 'dot1threeFieldsMode']">
                        <rect height="5" rx="2" ry="2" style="fill:none;stroke:white;stroke-width:1;" width="5" x="1"
                              y="1"/>
                    </svg>
                    <svg v-bind:class="[oneFieldMode ? 'dot' : 'dot']">
                        <rect height="5" rx="2" ry="2" style="fill:none;stroke:white;stroke-width:1;" width="5" x="1"
                              y="1"/>
                    </svg>
                    <svg v-bind:class="[oneFieldMode ? 'dot' : 'dot3threeFieldsMode']">
                        <rect height="5" rx="2" ry="2" style="fill:none;stroke:white;stroke-width:1;" width="5" x="1"
                              y="1"/>
                    </svg>
                </div>
            </div>

            <div class="subbox-distance noselect-nodrag">
                <div :class="calculatedField === 'distance' ? 'calculated noselect-nodrag' : ''"
                     @click="focusMe('distance')"
                     class="box distance">
                    <label for="distance">Distance</label>
                    <input :disabled="calculatedField === 'distance'" @focus="showPresetDistances = true"
                           @keyup="checkFields" autocomplete="off"
                           id="distance" name="distance" onblur=""
                           ref="distance" tabindex="2"
                           v-model="distance"/>
                    <span class="noselect-nodrag">km</span>
                </div>
                <label>
                    <select v-model="presetDistances" v-show="showPresetDistances">
                        <option disabled value="">Distances officielles</option>
                        <option>Marathon</option>
                        <option>Semi-Marathon</option>
                        <option>10km</option>
                    </select>
                </label>
            </div>

            <div :class="calculatedField === 'speed' ? 'calculated noselect-nodrag' : ''"
                 @click="focusMe('speed')" class="box speed" style="position:relative;">
                <label for="speed" v-if="speedFormat === 'speed'">Vitesse</label>
                <input :disabled="calculatedField === 'speed'" @focus="showPresetDistances = false"
                       @keyup="checkFields" autocomplete="off"
                       id="speed" name="speed" ref="speed" tabindex="3"
                       v-if="speedFormat === 'speed'" v-model="speed"/>
                <label for="pace" v-if="speedFormat === 'pace'">Allure</label>
                <input :disabled="calculatedField === 'pace'" @focus="showPresetDistances = false"
                       @keyup="checkFields" autocomplete="off" id="pace" name="speed"
                       placeholder="Rythme" v-if="speedFormat === 'pace'" v-model="pace"/>
                <span class="noselect-nodrag" v-on:dblclick="changeSpeedFormat">{{ speedDisplayedFormat }}</span>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Calculator.vue",
        data() {
            return {
                /* duration */
                duration: '',
                durationDisplayed: '',
                durationDisplayedFormat: 'h',
                oneFieldMode: true,
                durationHours: '',
                durationMinutes: '',
                durationSeconds: '',
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
        methods: {
            checkFields() {
                if (this.duration !== '' && this.distance !== '' && (this.speed === '' || this.calculatedField === 'speed')) {
                    this.calculatedField = 'speed';
                    this.speed = (this.formatDistance(this.distance) / this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '');
                    this.speed = this.speed === '' ? '< 0.001km/h' : this.speed;
                } else if (this.distance !== '' && this.speed !== '' && (this.duration === '' || this.calculatedField === 'duration')) {
                    this.calculatedField = 'duration';
                    this.duration = this.prettyDuration((this.formatDistance(this.distance) / this.formatSpeed(this.speed))
                        .toFixed(3)
                        .replace(/\.?0+$/, ''));
                    // eslint-disable-next-line no-console
                    this.duration = this.duration === '' ? '< 1sec' : this.duration;
                } else if (this.speed !== '' && this.duration !== '' && (this.distance === '' || this.calculatedField === 'distance')) {
                    this.calculatedField = 'distance';
                    this.distance = (this.formatSpeed(this.speed) * this.formatDuration(this.duration))
                        .toFixed(3)
                        .replace(/\.?0+$/, '');
                    this.distance = this.distance === '' ? '< 0.001m' : this.distance;
                } else {
                    this.calculatedField = ''
                }
            },
            clearFields() {
                this.duration = '';
                this.speed = '';
                this.distance = '';
                this.calculatedField = '';
                this.durationDisplayedFormat = 'h';
            },
            formatSpeed(speed) {
                speed = speed.replace(',', '.');
                return speed

            },
            formatDistance(distance) {
                distance = distance.replace(',', '.');
                return distance
            },
            // nbFields == 1 : hour format, nbFields == 3 : hours, minutes, seconds
            formatDuration: function (duration, nbReturnedFields = 1) {
                // hours only
                if (/^\d+$/.test(duration)) {
                    return duration;
                    // hours / minutes / seconds
                } else {
                    let hours = 0;
                    let minutes = 0;
                    let seconds = 0;

                    let nbFields = (this.duration.match(/[:mhs]/g) || []).length + 1;
                    // dans ce cas, on a des h, des m, des s
                    if (nbFields >= 3) {
                        hours = this.duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '');
                        if (this.duration.match(/[:h](\d*)[m:]/g)) {
                            minutes = this.duration.match(/[:h](\d*)[m:]/g)[0].replace(/[hm:]*/g, '');
                        }
                        seconds = this.duration.match(/[:mh](\d*)s?$/g)[0].replace(/[hms:]*/g, '');
                        console.log(`seconds ${seconds}`)
                    } else if (nbFields === 2) {
                        // si un h ou un : && !s > calcul h / m
                        if ((this.duration.match(/[:h]/g) || []).length === 1 && (this.duration.match(/[s]/g) || []).length === 0) {
                            hours = this.duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '');
                            minutes = this.duration.match(/[:h](\d*)[m:]?/g)[0].replace(/[hm:]*/g, '') || 0;
                            // si un h ou un : && s > calcul h / s
                        } else if ((this.duration.match(/[:h]/g) || []).length === 1 && (this.duration.match(/[s]/g) || []).length === 1) {

                            hours = this.duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '');
                            seconds = this.duration.match(/[:h](\d*)[s:]/g)[0].replace(/[hs:]*/g, '') || 0;
                            // sinon > calcul m / s
                        } else if ((this.duration.match(/[m]/g) || []).length === 1) {
                            minutes = this.duration.match(/(^\d*)[m:]/g)[0].replace(/[hm:]*/g, '');
                            seconds = this.duration.match(/[:m](\d*)[s:]?/g)[0].replace(/[ms:]*/g, '') || 0;
                        } else {
                            seconds = this.duration.match(/(\d*)[s:]?/g)[0].replace(/s*/g, '') || 0;
                        }

                    } else if (nbFields === 1) {
                        hours = this.duration.replace('h', '');
                    }

                    if (nbReturnedFields === 1) {
                        return parseFloat(hours) + (parseFloat(minutes) / 60) + (parseFloat(seconds) / 3600)
                    } else if (nbReturnedFields === 3) {
                        return {
                            'hours': parseFloat(hours),
                            'minutes': parseFloat(minutes),
                            'seconds': parseFloat(seconds)
                        }
                    }

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
            },
            focusMe: function (field) {
                // if field clicked eq "distance", shows the preset distances
                this.showPresetDistances = field === 'distance';
                // exception for threeFieldsMode
                if (this.oneFieldMode || field !== 'duration') {
                    this.$refs[field].focus();
                }
            }
        },
        watch: {
            duration: function () {
                if (this.duration === '') {
                    if (this.calculatedField === 'speed') {
                        this.speed = '';
                        this.pace = '';
                    } else if (this.calculatedField === 'distance') {
                        this.distance = '';
                    }
                } else if (this.calculatedField !== 'duration') {
                    // removing faulty characters
                    this.duration = this.duration.replace(/[^0-9,.:hms]/g, '');
                    // removing leading zero(s)
                    this.duration = this.duration.replace(/^0*([1-9]*)/g, '$1');
                    if (this.duration.match(/(\d{1,4}([h:]|[h:]?$))?(\d{1,2}([m:]|[m:]?$))?(\d{1,2}([s]|[s]?$))?/g)) {
                        this.duration = this.duration.match(/(\d{1,4}([h:]|[h:]?$))?(\d{1,2}([m:]|[m:]?$))?(\d{1,2}([s]|[s]?$))?/g)[0];
                        // formatting character for display
                        if ((this.duration.match(/[h:]/g) || []).length === 1 && (this.duration.match(/[ms]/g) || []).length === 0) {
                            this.durationDisplayedFormat = 'm'
                        } else if ((this.duration.match(/[s]/g) || []).length === 1) {
                            this.durationDisplayedFormat = ''
                        } else if ((this.duration.match(/[hm:]/g) || []).length >= 1) {
                            this.durationDisplayedFormat = 's'
                        } else {
                            this.durationDisplayedFormat = 'h'
                        }
                    } else {
                        this.duration = ''
                    }
                } else if (this.calculatedField === 'duration') {
                    // formatting character for display
                    this.durationDisplayedFormat = ''
                }
                let durationInHours = this.formatDuration(this.duration);
                this.$store.commit('setDuration', durationInHours);
            },
            distance: function (newVal, oldVal) {
                if (this.distance === '') {
                    if (this.calculatedField === 'speed') {
                        this.speed = '';
                        this.pace = ''
                    } else if (this.calculatedField === 'duration') {
                        this.duration = ''
                    }

                } else if (this.calculatedField !== 'distance') {
                    // check leading zero is followed by zero or , / .
                    if (this.distance.match(/^0{2,}(?![.,])/g)) {
                        // if yes : cancelling the input
                        this.distance = oldVal
                    }
                    // removing all others leading zeros by
                    this.distance = this.distance.replace(/^0([0-9]+)/g, '$1');

                    // if distances matches at least partially with the pattern ?
                    if (this.distance.match(/\d+([.,]\d{0,4})?/g)) {
                        // if not exactly match
                        if (this.distance.match(/\d+([.,]\d{0,4})?/g)[0] !== this.distance) {
                            // cancelling the input
                            this.distance = oldVal
                        }
                        // else : cancelling the input
                    } else {
                        this.distance = oldVal
                    }
                }
                this.checkFields();
                this.$store.commit('setDistance', this.distance);
            },
            speed: function (newVal, oldVal) {
                if (this.speed === '') {
                    if (this.calculatedField === 'duration') {
                        this.duration = ''
                    } else if (this.calculatedField === 'distance') {
                        this.distance = ''
                    }
                } else if (this.calculatedField !== 'speed') {
                    // check leading zero is followed by zero or , / .
                    if (this.speed.match(/^0{2,}(?![.,])/g)) {
                        // if yes : cancelling the input
                        this.speed = oldVal
                    }
                    // removing all others leading zeros by
                    this.speed = this.speed.replace(/^0([0-9]+)/g, '$1');

                    // if distances matches at least partially with the pattern ?
                    if (this.speed.match(/\d+([.,]\d{0,4})?/g)) {
                        // if not exactly match
                        if (this.speed.match(/\d+([.,]\d{0,4})?/g)[0] !== this.speed) {
                            // cancelling the input
                            this.speed = oldVal
                        }
                        // else : cancelling the input
                    } else {
                        this.speed = oldVal
                    }
                }
                this.$store.commit('setSpeed', this.speed);
            },
            presetDistances: function () {
                if (this.calculatedField !== 'distance') {
                    switch (this.presetDistances) {
                        case 'Marathon':
                            this.distance = "42,195";
                            break;
                        case 'Semi-Marathon' :
                            this.distance = "21,0975";
                            break;
                        case '10km' :
                            this.distance = "10";
                            break;
                    }
                }
            },
            calculatedField: function () {
                if (this.calculatedField === 'distance') {
                    this.prettyCalculatedField = "distance"
                } else if (this.calculatedField === 'speed') {
                    this.prettyCalculatedField = "vitesse"
                } else if (this.calculatedField === 'duration') {
                    this.prettyCalculatedField = "durée"
                }
            },
            durationHours: function () {
            },
            durationMinutes: function () {

            },
            durationSeconds: function () {
                console.log(this.durationSeconds)

            },
            oneFieldMode: function () {
                if (this.oneFieldMode) {
                    this.duration = this.durationtHours !== '' ? this.durationHours + 'h' : '';
                    this.duration += this.durationMinutes !== '' ? this.durationMinutes + 'm' : '';
                    this.duration += this.durationSeconds !== '' ? this.durationSeconds + 's' : '';
                } else {
                    this.durationHours = this.formatDuration(this.duration, 3).hours || "";
                    this.durationMinutes = this.formatDuration(this.duration, 3).minutes || "";
                    this.durationSeconds = this.formatDuration(this.duration, 3).seconds || "";

                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-box {
        position: relative;
        background: $ma-primary;
        background: linear-gradient($ma-primary, #70a9d2);
        color: white;
        transition: all 0.5s;

        @media (min-device-width: 600px) {
            border-radius: 13px;
        }
        padding: 3vh 3vh 3vh 3vh;
        box-shadow: 0 5px 10px rgba(33, 33, 33, .2);
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
        height: 5vh;
        box-shadow: 0 0 10px rgba(33, 33, 33, .2);
        background-color: white;
        margin: 2vh 1vw 2vh 1vw;
        padding: 1vh 2vw 1vh 2vw;
        color: $ma-primary;
        font-size: 1.1em;
        transition: width .5s;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .box:hover(:not(calculated)) {
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    }

    .footer {
        height: 5vh;
        margin-top: auto;
        text-align: center;
    }

    .icon {
        width: 20px;
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
        box-shadow: 0 8px 15px #FF9900, 0 6px 6px rgba(0, 0, 0, 0.23);
        background-color: #FF9900;
        animation: scale-up 0.2s forwards, scale-out 0.5s;
        font-size: 1.4em;
        color: white;
        margin: 2vh 1vh 2vh 1vh;
    }

    input {
        color: $ma-primary;
    }

    input {
        background-color: rgba(0, 0, 0, 0.0);
        font-size: 1em;
        text-align: right;
        padding-right: 0.2em;
        border: none;
        width: 100px;
        min-width: 50px;
        transition: all 0.5s;
    }

    input:focus {
        outline: none;
    }

    select {
        background-color: rgba(0, 0, 0, 0.0);
        border: 1px white solid;
        border-radius: 5px;
        text-align: center;
        padding: 5px 5px 5px 5px;
        font-size: 1em;
        color: white;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';

        > option {
            color: $ma-primary;
            text-align: center;
        }
    }

    select:focus {
        outline: none;
    }

    .noselect-nodrag {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        cursor: default;
    }

    h1 {
        font-size: 2.5em;
        text-align: center;
    }

    @keyframes scale-up {
        from {
            transform: scale(1.0);
        }
        to {
            transform: scale(1.05);
        }
    }

    @keyframes scale-down {
        from {
            transform: scale(1.05);
        }
        to {
            transform: scale(1.0);
        }
    }

    .settings-box {
        $left-pos: 88.5%;
        position: absolute;
        display: flex;
        justify-content: flex-end;
        top: 20%;
        left: $left-pos;
        background: $ma-primary;
        background: linear-gradient(to left, #9d3077, #70a9d2);
        color: white;
        text-align: center;
        border-radius: 13px;
        padding: 1vh 0 1vh 3vw;
        box-shadow: 0 5px 10px rgba(33, 33, 33, .2);
        transition: left 0.5s;

        &:hover {
            left: $left-pos + 1%;
        }

        &:active {
            animation: flip-over 0.7s forwards;
        }
    }

    .clear-fields-button {
        margin-left: 0.10em;
        width: 0.8rem;
        transition: all .1s ease-in-out;
        cursor: pointer;

        &:hover {
            transform: scale(1.05);
        }
    }

    .calculated-label {
        text-decoration: underline;
        text-decoration-color: #FF9900;
    }

    .duration-display-switch {
        position: relative;
    }

    .dot {
        width: 10px;
        height: 10px;
        position: absolute;
        left: 50%;
        transition: 500ms;
    }

    .dot1threeFieldsMode {
        width: 10px;
        height: 10px;
        position: absolute;
        left: 45%;
        transition: 500ms;
    }

    .dot3threeFieldsMode {
        width: 10px;
        height: 10px;
        position: absolute;
        left: 55%;
        transition: 500ms;
    }
</style>