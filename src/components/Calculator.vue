<template>
    <div class="main-box p-6">
        <div class="flex h-8" v-if="calculatedField === ''">
            <img alt=" " class="w-8" src="../assets/icons/timer.svg"/>
            <h2 class="noselect-nodrag self-center pl-2 font-semibold">Calculateur de vitesse, de durée, de
                distance</h2>

        </div>
        <div class="noselect-nodrag flex h-8" v-else>
            <img alt=" " class="w-8" src="../assets/icons/timer.svg"/>
            <h2 class="self-center font-semibold pl-2">Calcul de la <span
                    class="self-center font-semibold underline calculated-label">{{ prettyCalculatedField }}</span></h2>
            <span><img @click="clearFields()" alt="clear field button" class="clear-fields-button"
                       src="../assets/icons/cancel.svg"/></span>
        </div>
        <div class="wrapper">
            <!-- DURATION -->
            <div class="flex flex-col noselect-nodrag items-center">
                <div :class="calculatedField === 'duration' ? 'calculated noselect-nodrag' : ''"
                     @click="focusMe('duration')" class="box self-stretch justify-between">
                    <label for="duration">Durée</label>
                    <div class="one-field-mode" v-if="oneFieldMode">
                        <!-- Field for 1 field mode -->
                        <input :disabled="calculatedField === 'duration'" @focus="focusMe('duration')"
                               @keyup="checkFields"
                               autocomplete="off" id="duration" ref="duration"
                               tabindex="1" v-model="duration"/>
                        <span class="noselect-nodrag">{{ durationDisplayedFormat }}</span>
                    </div>
                    <div class="flex" v-show="!oneFieldMode">
                        <label>
                            <!-- Fields for 3 fields mode -->
                            <input :disabled="calculatedField === 'duration'" @focus="focusMe('duration')"
                                   @keydown.delete.left.right="updateCursor('hours',$event)" @keyup="checkFields"
                                   autocomplete="off" placeholder="hh" ref="hours"
                                   style="text-align: center; width:20px;padding-right: 5px;"
                                   tabindex="1"
                                   v-model="durationHours"/>
                            <span class="noselect-nodrag">:</span>
                            <input :disabled="calculatedField === 'duration'" @focus="focusMe('duration')"
                                   @keydown.delete.left.right="updateCursor('minutes',$event)" @keyup="checkFields"
                                   autocomplete="off" placeholder="mm" ref="minutes"
                                   style="text-align: center; width:20px;padding-right: 5px;"
                                   tabindex="1"
                                   v-model="durationMinutes"/>
                            <span class="noselect-nodrag">:</span>
                            <input :disabled="calculatedField === 'duration'" @focus="focusMe('duration')"
                                   @keydown.delete.left.right="updateCursor('seconds',$event)" @keyup="checkFields"
                                   autocomplete="off" placeholder="ss" ref="seconds"
                                   style="text-align: center; width:20px;padding-right: 5px;"
                                   tabindex="1"
                                   v-model="durationSeconds"/>
                        </label>
                    </div>
                </div>
                <div @click="oneFieldMode = !oneFieldMode"
                     class="duration-display-switch w-20 h-8 border rounded flex items-center cursor-pointer noselect-nodrag">
                    <svg v-bind:class="[oneFieldMode ? 'dot' : 'dot1threeFieldsMode']">
                        <rect height="5" rx="2" ry="2" style="fill:white;stroke:white;stroke-width:1;" width="5"
                              x="0"
                              y="0"/>
                    </svg>
                    <svg v-bind:class="[oneFieldMode ? 'dot' : 'dot']">
                        <rect height="5" rx="2" ry="2" style="fill:white;stroke:white;stroke-width:1;" width="5"
                              x="0"
                              y="0"/>
                    </svg>
                    <svg v-bind:class="[oneFieldMode ? 'dot' : 'dot3threeFieldsMode']">
                        <rect height="5" rx="2" ry="2" style="fill:white;stroke:white;stroke-width:1;" width="5"
                              x="0"
                              y="0"/>
                    </svg>
                </div>
            </div>

            <!-- DISTANCE -->
            <div class="flex flex-col noselect-nodrag items-center">
                <div :class="calculatedField === 'distance' ? 'calculated noselect-nodrag' : ''"
                     @click="focusMe('distance')"
                     class="box distance self-stretch justify-between">
                    <label for="distance">Distance</label>
                    <div>
                        <input :disabled="calculatedField === 'distance'" @focus="showPresetDistances = true"
                               @keyup="checkFields" autocomplete="off"
                               id="distance" name="distance" onblur=""
                               ref="distance" tabindex="2"
                               v-model="distance"/>
                        <span class="noselect-nodrag">km</span>
                    </div>
                </div>
                <label>
                    <select class="border p-1 rounded" v-model="presetDistances" v-show="showPresetDistances">
                        <option disabled value="">Distances officielles</option>
                        <option v-bind:value="preset.label" v-for="preset in $store.state.defaultDistances">
                            {{ preset.label }}
                        </option>
                    </select>
                </label>
            </div>

            <!-- SPEED -->
            <div class="flex flex-col items-center">
                <div :class="calculatedField === 'speed' ? 'calculated noselect-nodrag' : ''"
                     @click="focusMe('speed')" class="box speed self-stretch justify-between">
                    <label for="speed" v-if="speedFormat === 'speed'">Vitesse</label>
                    <label for="pace" v-if="speedFormat === 'pace'">Allure</label>
                    <div>
                        <input :disabled="calculatedField === 'speed'" @focus="showPresetDistances = false"
                               @keydown.up="upspeed" @keyup="checkFields" autocomplete="off"
                               id="speed" name="speed" ref="speed" tabindex="3"
                               v-if="speedFormat === 'speed'" v-model="speed"/>
                        <input :disabled="calculatedField === 'speed'" @focus="showPresetDistances = false"
                               @keyup="checkFields" autocomplete="off" id="pace" name="speed" ref="speed"
                               v-if="speedFormat === 'pace'" v-model="pace"/>
                        <span class=""
                              v-on:dblclick="changeSpeedFormat">{{ speedDisplayedFormat }}</span>
                    </div>
                </div>
                <div @click="changeSpeedFormat" class="flex border p-1 rounded h-8 noselect-nodrag cursor-pointer">
                    <img alt="switch between pace and speed" class="w-5 mr-1 noselect-nodrag"
                         src="../assets/icons/arrows.svg"/>
                    <span v-if="speedFormat === 'speed'">Allure</span>
                    <span v-if="speedFormat === 'pace'">Vitesse</span>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
    export default {
        name: "Calculator",
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
                this.durationHours = '';
                this.durationMinutes = '';
                this.durationSeconds = '';
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
                return distance.replace(',', '.');
            },
            // nbFields == 1 : hour format, nbFields == 3 : hours, minutes, seconds
            formatDuration: function (duration, nbReturnedFields = 1) {
                // hours only
                if (/^\d+$/.test(duration) || duration === "") {
                    if (nbReturnedFields !== 3) {
                        return duration
                    } else {
                        return {'hours': parseFloat(duration) || ""}
                    }
                    // hours / minutes / seconds
                } else {
                    let hours = 0;
                    let minutes = 0;
                    let seconds = 0;

                    let nbFields = (this.duration.match(/[:mhs]/g) || []).length + 1;
                    // dans ce cas, on a des h, des m, des s OU h / m, m / s
                    if (nbFields >= 3) {
                        if (this.duration.match(/(^\d*)[h:]/g)) {
                            hours = this.duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '') || 0;
                        }
                        if (this.duration.match(/[:h]?(\d*)[m:]/g)) {
                            minutes = this.duration.match(/[:h]?(\d*)[m:]/g)[0].replace(/[hm:]*/g, '') || 0;
                        }
                        if (this.duration.match(/[:mh](\d*)s?$/g)) {
                            seconds = this.duration.match(/[:mh](\d*)s?$/g)[0].replace(/[hms:]*/g, '') || 0;
                        }
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
                            'hours': parseFloat(hours) || "",
                            'minutes': parseFloat(minutes) || "",
                            'seconds': parseFloat(seconds) || ""
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
                if (this.speedFormat === 'speed') {
                    this.speedFormat = 'pace';
                    this.pace = this.speedToPace(this.speed);
                    this.speedDisplayedFormat = 'min/km';
                } else {
                    this.speedFormat = 'speed';
                    this.speed = this.paceToSpeed(this.pace);
                    this.speedDisplayedFormat = 'km/h';
                }
            },
            focusMe: function (field) {
                // if field clicked eq "distance", shows the preset distances
                this.showPresetDistances = field === 'distance' && this.calculatedField !== 'distance';

                // exception for threeFieldsMode
                if (this.oneFieldMode || field !== 'duration') {
                    this.$refs[field].focus();
                }
            },
            updateCursor: function (ref, event) {
                // to left management (backspace OR left arrow)
                if (event.key === "Backspace" || event.key === "Delete" || event.key === "ArrowLeft") {
                    if (ref === "minutes" && (this.durationMinutes === "" || this.$refs['minutes'].selectionStart === 0)) {
                        if (this.$refs['minutes'].selectionStart === this.$refs['minutes'].selectionEnd) {
                            event.preventDefault();
                            this.$refs['hours'].setSelectionRange(this.durationHours.length, this.durationHours.length);
                            this.$refs['hours'].focus();
                        }
                    }
                    if (ref === "seconds" && (this.durationSeconds === "" || this.$refs['seconds'].selectionStart === 0)) {
                        if (this.$refs['seconds'].selectionStart === this.$refs['seconds'].selectionEnd) {
                            event.preventDefault();
                            this.$refs['minutes'].setSelectionRange(this.durationMinutes.length, this.durationMinutes.length);
                            this.$refs['minutes'].focus();
                        }
                    }
                    // to right management
                } else {
                    if (ref === 'hours' && this.$refs[ref].selectionStart === this.durationHours.length) {
                        event.preventDefault();
                        this.$refs['minutes'].setSelectionRange(0, 0);
                        this.$refs['minutes'].focus();
                    } else if (ref === 'minutes' && this.$refs[ref].selectionStart === this.durationMinutes.length) {
                        event.preventDefault();
                        this.$refs['seconds'].setSelectionRange(0, 0);
                        this.$refs['seconds'].focus();
                    }
                }
            },
            paceToSpeed: function (pace) {
                if (pace !== "") {
                    let minutes = 0;
                    let seconds = 0;
                    if (pace.match(/(^\d{1,2})[:]?/g)) {
                        minutes = pace.match(/(\d{1,2})[:]?/)[1];
                    }
                    if (pace.match(/[:](\d{1,2})/g)) {
                        seconds = pace.match(/[:](\d{1,2})?/)[1];
                    }
                    let speed = 60 / (parseInt(minutes) + parseInt(seconds) / 60);
                    return speed.toFixed(3).replace(/\.?0+$/, '');
                } else return "";
            },
            speedToPace: function (speed) {
                if (speed !== "") {
                    let pace = 60 / speed;
                    let minutes = pace | 0;
                    let seconds = ((pace % 1) * 60) | 0;
                    seconds = seconds < 10 && seconds > 0 ? '0' + seconds : seconds;
                    seconds = seconds === 0 ? "00" : seconds;
                    return minutes + ":" + seconds
                } else return "";


            }
        },
        watch: {
            duration: function (newVal, oldVal) {
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

                    // if duration  matches at least partially with the pattern ?
                    if (this.duration.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]|[s]?$))?/g)) {
                        // if not exactly match
                        if (this.duration.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]|[s]?$))?/g)[0] !== this.duration) {
                            this.duration = oldVal
                        } else {
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
                        }
                        // else cancelling the input
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
                if (this.$store.state.defaultDistances.find(defaultDist =>
                    defaultDist.distance === this.distance)) {
                    this.presetDistances = this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.distance === this.distance).label;
                } else {
                    this.presetDistances = ""
                }

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

                    // if distance matches at least partially with the pattern ?
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
                    // check leading zero is followed by zero, and not by , / .
                    if (this.speed.match(/^0{2,}(?![.,])/g)) {
                        // if yes : cancelling the input
                        this.speed = oldVal
                    }
                    // removing all others leading zeros
                    this.speed = this.speed.replace(/^0([0-9]+)/g, '$1');

                    // if speed matches at least partially with the pattern ?
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
            pace: function (newVal, oldVal) {
                if (this.pace === '') {
                    if (this.calculatedField === 'speed') {
                        this.speed = '';
                        this.pace = ''
                    } else if (this.calculatedField === 'duration') {
                        this.duration = ''
                    } else if (this.calculatedField === 'distance') {
                        this.distance = ''
                    }
                }

                if (this.pace !== "") {
                    // check leading zero is followed by zero, and not by =
                    if (this.pace.match(/^0{2,}(?![:])?/g)) {
                        // if yes : cancelling the input
                        this.pace = oldVal;
                    }
                    // if pace matches at least partially with the pattern ?
                    if (this.pace.match(/(\d{1,2}:(\d{1,2})?)|(:?\d{1,2})|:/g)) {
                        // if not exactly match
                        if (this.pace.match(/(\d{1,2}:(\d{1,2})?)|(:?\d{1,2})|:/g)[0] !== this.pace) {
                            // cancelling the input
                            this.pace = oldVal
                        }
                        // else : cancelling the input
                    } else {
                        this.pace = oldVal
                    }
                }
                this.speed = this.paceToSpeed(this.pace)
            },
            presetDistances: function () {
                if (this.calculatedField !== 'distance') {
                    if (this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.label === this.presetDistances)) {
                        this.distance = this.$store.state.defaultDistances.find(defaultDist =>
                            defaultDist.label === this.presetDistances).distance;
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
            durationHours: function (newVal, oldVal) {
                if (this.durationHours !== '') {
                    if (this.durationHours.match(/([0-9]?[0-9])/g)) {
                        // if not exactly match
                        if (this.durationHours.match(/([0-9]?[0-9])/g)[0] !== this.durationHours) {
                            // cancelling the input
                            this.durationHours = oldVal
                        } else if (this.durationHours.match(/([0-9][0-9])/g)) {
                            this.$refs.minutes.focus();
                        }
                    }
                    // else : cancelling the input
                    else {
                        this.durationHours = oldVal
                    }
                }
                this.duration = this.durationHours !== '' ? this.durationHours + 'h' : '';
                this.duration += this.durationMinutes !== '' ? this.durationMinutes + 'm' : '';
                this.duration += this.durationSeconds !== '' ? this.durationSeconds + 's' : '';
            },
            durationMinutes: function (newVal, oldVal) {
                if (this.durationMinutes !== '') {
                    if (this.durationMinutes.match(/([0-5]?[0-9])/g)) {
                        // if not exactly match
                        if (this.durationMinutes.match(/([0-5]?[0-9])/g)[0] !== this.durationMinutes) {
                            // cancelling the input
                            this.durationMinutes = oldVal
                        } else if (this.durationMinutes.match(/([0-5][0-9])/g)) {
                            if (!this.oneFieldMode) {
                                this.$refs.seconds.focus();
                            }
                        }
                    }
                    // else : cancelling the input
                    else {
                        this.durationMinutes = oldVal
                    }
                }
                this.duration = this.durationHours !== '' ? this.durationHours + 'h' : '';
                this.duration += this.durationMinutes !== '' ? this.durationMinutes + 'm' : '';
                this.duration += this.durationSeconds !== '' ? this.durationSeconds + 's' : '';
            },
            durationSeconds: function (newVal, oldVal) {
                if (this.durationSeconds !== '') {
                    if (this.durationSeconds.match(/([0-5]?[0-9])/g)) {
                        // if not exactly match
                        if (this.durationSeconds.match(/([0-5]?[0-9])/g)[0] !== this.durationSeconds) {
                            // cancelling the input
                            this.durationSeconds = oldVal
                        }
                    }
                    // else : cancelling the input
                    else {
                        this.durationSeconds = oldVal
                    }
                }
                this.duration = this.durationHours !== '' ? this.durationHours + 'h' : '';
                this.duration += this.durationMinutes !== '' ? this.durationMinutes + 'm' : '';
                this.duration += this.durationSeconds !== '' ? this.durationSeconds + 's' : '';
            },
            oneFieldMode: function () {
                if (this.oneFieldMode) {
                    this.duration = this.durationHours !== '' ? this.durationHours + 'h' : '';
                    this.duration += this.durationMinutes !== '' ? this.durationMinutes + 'm' : '';
                    this.duration += this.durationSeconds !== '' ? this.durationSeconds + 's' : '';
                } else {
                    this.durationHours = String((this.formatDuration(this.duration, 3).hours) || "");
                    this.durationMinutes = String((this.formatDuration(this.duration, 3).minutes) || "");
                    this.durationSeconds = String((this.formatDuration(this.duration, 3).seconds) || "");
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-box {
        background: $ma-primary;
        background: linear-gradient($ma-primary, #70a9d2);
        color: white;
        transition: all 0.5s;

        @media (min-device-width: 600px) {
            border-radius: 13px;
        }
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
        min-height: 40px;

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
        text-align: center;
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
        text-decoration-color: #FF9900;
    }

    .duration-display-switch {
        position: relative;
        z-index: 0;

    }

    .dot {
        width: 5px;
        height: 5px;
        position: absolute;
        left: 50%;
        transition: 500ms;
    }

    .dot1threeFieldsMode {
        width: 5px;
        height: 5px;
        position: absolute;
        left: 20%;
        transition: 500ms;
    }

    .dot3threeFieldsMode {
        width: 5px;
        height: 5px;
        position: absolute;
        left: 80%;
        transition: 500ms;
    }
</style>