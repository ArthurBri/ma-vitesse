<template>
    <div class="main-box flex-grow-0 p-6 m-4 xs:ml-0 xs:mr-0 sm:mr-0 sm:ml-0 xs:m-0 xs:pl-0 xs:pr-0 xs:w-full sm:w-full text-white overflow-x-auto">
        <div class="flex h-8 mb-2 items-center content-center" v-if="!calculatedField">
            <img alt="calaculator icon" class="w-8 sm:ml-4 xs:ml-4 noselect-nodrag" src="../assets/icons/timer.svg"/>
            <h2 class="noselect-nodrag self-center pl-2 font-semibold xs:mr-4 sm:mr-4 xl:text-xl">
                {{ $t('calculator.description')}}</h2>
        </div>
        <div class="flex justify-between h-8 mb-2" v-else>
            <div class="flex">
                <img alt=" " class="w-8 sm:ml-4 xs:ml-4 noselect-nodrag" src="../assets/icons/timer.svg"/>
                <div class="flex self-center pl-2 font-semibold sm:mr-4 ">
                    <h2 class="xl:text-xl" v-if="$i18n.locale === 'fr'">{{ $t('calculator.calculation_label')}}<span
                            class="self-center font-semibold calculated-label">{{ $t('common.' + calculatedField + '_lc') }}</span>
                    </h2>
                    <h2 class="xl:text-xl" v-else> <span
                            class="self-center font-semibold calculated-label">{{ $t('common.' + calculatedField) }}</span>
                        {{ $t('calculator.calculation_label')}}
                    </h2>
                    <span><img @click="clearFields" alt="clear field button"
                               class="h-2 noselect-nodrag clear-fields-button"
                               src="../assets/icons/cancel.svg"/></span>
                </div>
            </div>
            <div class="xs:mr-2">
                <share-social/>
            </div>
        </div>
        <div class="wrapper" style="min-height:3rem;">
            <!-- DURATION -->
            <duration-field 
                :isCalculated="calculatedField === 'duration'"/>
        

            <!-- DISTANCE -->
            <div class="flex flex-col h-24 noselect-nodrag">
                <div :class="calculatedField === 'distance' ? 'calculated noselect-nodrag' : ''"
                     class="box distance self-stretch justify-between shadow-md">
                    <label @click="focusMe('distance')" for="distance">{{ $t('calculator.distance') }}</label>
                    <div class="flex">
                        <input :disabled="calculatedField === 'distance'" @focus="showPresetDistances = true"
                               autocomplete="off"
                               class="text-right pr-1 number-input w-32" id="distance" name="distance" onblur=""
                               @keydown.down="decrement('distance')" @keydown.up="increment('distance')"
                               inputmode="decimal" pattern="[0-9,.]*"
                               ref="distance" v-model="distance"/>
                        <label aria-label="Switch between distance units" for="distance-unit"/>
                        <select @change="unitChange('distance', $event.target.value)" id="distance-unit"
                                class="self-center text-right cursor-pointer" tabindex="-1" v-model="distanceUnit">
                            <option :value="item.type" v-for="item in distanceUnits">{{ item.type }}</option>
                        </select>
                    </div>
                </div>
                <label class="box-option preset-distances noselect-nodrag"
                       v-show="showPresetDistances">
                    <select class="cursor-pointer" tabindex="-1" v-model="presetDistances">
                        <option disabled value="">{{ $t('calculator.my_distances')}}</option>
                        <option v-bind:value="preset.label" v-for="preset in $store.state.defaultDistances">
                            {{ preset.label }}
                        </option>
                        <option class="text-italic appearance-none" value="addDistance">+ {{$t('common.add')}}</option>
                        <option class="text-italic appearance-none" v-if="this.$store.state.defaultDistances.length > 0"
                                value="removeDistance">- {{$t('common.delete')}}
                        </option>

                    </select>
                </label>
                <span class="h-8 pt-1 pb-1" v-show="!showPresetDistances"></span>
            </div>

            <!-- SPEED -->
            <div class="flex flex-col h-24 h-">
                <div :class="calculatedField === 'speed' ? 'calculated noselect-nodrag' : ''"
                     class="box speed self-stretch justify-between shadow-md">
                    <label @click="focusMe('speed')" class="w-16 sm:w-8 noselect-nodrag" for="speed"
                           v-if="speedFormat === 'speed'">
                        {{ $t('calculator.speed') }}
                    </label>
                    <label @click="focusMe('speed')" class="w-16 sm:w-8 noselect-nodrag" for="pace"
                           v-if="speedFormat === 'pace'">
                        {{ $t('calculator.pace') }}
                    </label>
                    <div class="flex w-48" style="flex: 0 0 50px">
                        <!-- Speed display -->
                        <div class="flex items-stretch justify-end" v-if="speedFormat === 'speed'">
                            <input :disabled="calculatedField === 'speed'" @focus="showPresetDistances = false"
                                   autocomplete="off"
                                   class="text-right pr-1 xs:w-20 w-32 number-input"
                                   id="speed" inputmode="decimal" name="speed" pattern="[0-9,.]*" ref="speed"
                                   @keydown.down="decrement('speed')" @keydown.up="increment('speed')"
                                   v-model="speed"/>
                            <label aria-label="Switch between speed units" for="speed-unit"/>
                            <select @change="unitChange('speed', $event.target.value)" id="speed-unit"
                                    class="self-center text-right cursor-pointer" tabindex="-1" v-model="speedUnit">
                                <option :value="item.type" v-for="item in speedUnits">
                                    {{ item.short }}
                                </option>
                            </select>
                        </div>
                        <!-- Pace display -->
                        <div class="flex items-stretch justify-end" v-if="speedFormat === 'pace'">
                            <input :disabled="calculatedField === 'speed'" @focus="showPresetDistances = false"
                                   autocomplete="off"
                                   class="text-right pr-1 xs:w-20 w-32" id="pace" name="speed"
                                   ref="speed" v-model="pace"/>
                            <label aria-label="Switch between pace units" for="pace-unit"/>
                            <select @change="unitChange('pace', $event.target.value)" id="pace-unit"
                                    class="self-center text-right cursor-pointer" tabindex="-1" v-model="paceUnit">
                                <option :value="item.type" v-for="item in paceUnits">{{ item.short }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <!-- Speed switch button -->
                <div :class="calculatedField === 'speed' ? 'active noselect-nodrag' : ''"
                     @click="changeSpeedFormat"
                     class="box-option noselect-nodrag">
                    <img :class="calculatedField === 'speed' ? 'icon-active' : ''" alt="switch between pace and speed"
                         class="w-4 h-6 mr-1 cursor-pointer noselect-nodrag"
                         src="../assets/icons/arrows.svg"/>
                    <span v-if="speedFormat === 'speed'">{{ $t('calculator.pace') }}</span>
                    <span v-if="speedFormat === 'pace'">{{ $t('calculator.speed') }}</span>
                </div>
            </div>
        </div>
        <share-m-a class="mt-4"/>
        <AddPresetDistance @close="closeAddDistance" v-show="addDistance"/>
        <RemovePresetDistance @close="closeRemoveDistance" v-show="removeDistance"/>
    </div>

</template>

<script>
    import AddPresetDistance from '@/components/AddPresetDistance'
    import RemovePresetDistance from '@/components/RemovePresetDistance'
    import ShareMA from "@/components/ShareMA"
    import ShareSocial from "@/components/ShareSocial"
    import {prettyDuration} from "@/utils/formatData"
import DurationField from './atoms/DurationField.vue'

    import {mapState} from 'vuex';

    export default {
        name: "Calculator",
        components: {ShareMA, AddPresetDistance, RemovePresetDistance, ShareSocial, DurationField},
        data() {
            return {
                /* distance */
                presetDistances: '',
                showPresetDistances: false,
                /* speed */
                pace: '',
                separator: '.',
                addDistance: false,
                removeDistance: false
            };
        },
        computed: {
            ...mapState(["unitMode", "unitMultipliers", "distanceUnit", "distanceUnits", "speedUnit", "speedUnits", "paceUnit", "paceUnits", "duration"]),
            speed: {
                get() {
                    return this.$store.state.speed
                },
                set(val) {
                    this.$store.commit('setSpeed', val)
                }
            },
            speedFormat: {
                get() {
                    return this.$store.state.speedFormat
                },
                set(val) {
                    this.$store.commit('setSpeedFormat', val)
                }
            },
            distance: {
                get() {
                    return this.$store.state.distance
                },
                set(val) {
                    this.$store.commit('setDistance', val)
                }
            },
            calculatedField: {
                get() {
                    return this.$store.state.calculatedField
                },
                set(val) {
                    this.$store.commit('setCalculatedField', val)
                }
            },
            speedUnit: {
                get() {
                    return this.$store.state.speedUnit
                },
                set() {
                }
            },
            paceUnit: {
                get() {
                    return this.$store.state.paceUnit
                },
                set() {
                }
            },
            distanceUnit: {
                get() {
                    return this.$store.state.distanceUnit
                },
                set() {
                }
            },
            handleCheckFields() {
                return [this.distance, this.duration, this.speed].join('')
            }
        },
        methods: {
            checkFields() {
                // separator set depending the one used in input
                if (this.calculatedField === 'distance') {
                    this.separator = this.speed.includes(",") ? "," : this.speed.includes(".") ? "." : this.separator;
                } else {
                    this.separator = this.distance.includes(",") ? "," : this.distance.includes(".") ? "." : this.separator;
                }

                let dis = !!this.distance;
                let dur = !!this.duration || (!!parseFloat(this.durationHours) || !!parseFloat(this.durationSeconds) || !!parseFloat(this.durationMinutes));
                let spe = !!this.speed || !!this.pace;

                // SPEED calculation
                if (dur && dis && (!spe || (spe && this.calculatedField === 'speed'))) {
                    this.calculatedField = 'speed';
                    this.speed = (this.formatDistance(this.distance) / this.formatDuration(this.durationString))
                        .toFixed(4)
                        .replace(/\.?0+$/, '').replace(/[.,]/, this.separator);
                    this.speed = this.speed === '' ? '< 0.001' : this.speed;
                    this.pace = this.speedToPace(this.speed)
                    // DURATION calculation
                } else if (dis && spe && (!dur || (dur && this.calculatedField === 'duration'))) {
                    this.calculatedField = 'duration';
                    this.$store.commit('setDuration', this.formatDistance(this.distance) / this.formatSpeed(this.speed));
                    // DISTANCE calculation
                } else if (spe && dur && (!dis || (dis && this.calculatedField === 'distance'))) {
                    this.calculatedField = 'distance';
                    this.distance = (this.formatSpeed(this.speed) * this.formatDuration(this.durationString))
                        .toFixed(4)
                        .replace(/\.?0+$/, '').replace(/[.,]/, this.separator);
                    this.distance = !this.distance ? '< 0.001' : this.distance;
                } else {
                    this.calculatedField = ''
                }
            },
            clearFields() {
                this.$store.commit('setDuration', '');
                this.durationHours = '';
                this.durationMinutes = '';
                this.durationSeconds = '';
                this.presetDistances = '';
                this.speed = '';
                this.pace = '';
                this.distance = '';
                this.calculatedField = '';
                this.durationDisplayedUnit = 'h';
            },
            formatSpeed(speed) {
                return String(speed).replace(',', '.');
            },
            formatDistance(distance) {
                return String(distance).replace(',', '.');
            },
            // nbFields == 1 : hour format, nbFields == 3 : hours, minutes, seconds
            formatDuration(duration, nbReturnedFields = 1) {
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

                    let nbFields = (duration.match(/[:mhs]/g) || []).length + 1;
                    // dans ce cas, on a des h, des m, des s OU h / m, m / s
                    if (nbFields >= 3) {
                        if (duration.match(/(^\d*)[h:]/g)) {
                            hours = duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '') || 0;
                        }
                        if (duration.match(/[:h]?(\d*)[m:]/g)) {
                            minutes = duration.match(/[:h]?(\d*)[m:]/g)[0].replace(/[hm:]*/g, '') || 0;
                        }
                        if (duration.match(/[:mh](\d*)s?$/g)) {
                            seconds = duration.match(/[:mh](\d*)s?$/g)[0].replace(/[hms:]*/g, '') || 0;
                        }
                    } else if (nbFields === 2) {
                        // si un h ou un : && !s > calcul h / m
                        if ((duration.match(/[:h]/g) || []).length === 1 && (duration.match(/[s]/g) || []).length === 0) {
                            hours = duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '');
                            minutes = duration.match(/[:h](\d*)[m:]?/g)[0].replace(/[hm:]*/g, '') || 0;
                            // si un h ou un : && s > calcul h / s
                        } else if ((duration.match(/[:h]/g) || []).length === 1 && (duration.match(/[s]/g) || []).length === 1) {
                            hours = duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '');
                            seconds = duration.match(/[:h](\d*)[s:]/g)[0].replace(/[hs:]*/g, '') || 0;
                            // sinon > calcul m / s
                        } else if ((duration.match(/[m]/g) || []).length === 1) {
                            if (duration.match(/(^\d*)[m:]/g)) {
                                minutes = duration.match(/(^\d*)[m:]/g)[0].replace(/[hm:]*/g, '') || 0;
                            }
                            seconds = duration.match(/[:m](\d*)[s:]?/g)[0].replace(/[ms:]*/g, '') || 0;
                        } else {
                            seconds = duration.match(/(\d*)[s:]?/g)[0].replace(/s*/g, '') || 0;
                        }

                    } else if (nbFields === 1) {
                        hours = duration.replace('h', '');
                    }

                    if (nbReturnedFields === 1) {
                        return parseFloat(hours) + (parseFloat(minutes) / 60) + (parseFloat(seconds) / 3600)
                    } else if (nbReturnedFields === 3) {
                        return {
                            hours: parseFloat(hours) || "",
                            minutes: parseFloat(minutes) || "",
                            seconds: parseFloat(seconds) || ""
                        }
                    }

                }
            },
            changeSpeedFormat() {
                if (this.speedFormat === 'speed') {
                    this.speedFormat = 'pace';
                    this.pace = this.speedToPace(this.speed);
                } else {
                    this.speedFormat = 'speed';
                    this.speed = this.paceToSpeed(this.pace).replace(/[.,]/, this.separator);
                }
                localStorage.speedFormat = this.speedFormat
            },
            focusMe(field) {
                // if field clicked eq "distance", shows the preset distances
                this.showPresetDistances = field === 'distance' && this.calculatedField !== 'distance';

                // exception in 3 fields mode : on clic on box, focus on hours
                if (!this.oneFieldMode && field !== 'duration') {
                    this.$refs[field].focus();
                } else this.$refs["durationString"].focus()
            },
            updateCursor(ref, event) {
                // to left management (backspace OR left arrow)
                if (event.key === "Backspace" || event.key === "Delete" || event.key === "ArrowLeft") {
                    if (ref === "minutes" && (this.durationMinutes === "" || this.$refs['minutes'].selectionStart === 0)) {
                        if (this.$refs['minutes'].selectionStart === this.$refs['minutes'].selectionEnd) {
                            event.preventDefault();
                            this.$refs['hours'].focus();
                        }
                    }
                    if (ref === "seconds" && (this.durationSeconds === "" || this.$refs['seconds'].selectionStart === 0)) {
                        if (this.$refs['seconds'].selectionStart === this.$refs['seconds'].selectionEnd) {
                            event.preventDefault();
                            this.$refs['minutes'].focus();
                        }
                    }
                // to right management
                } else if (event.key === "ArrowRight") {
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
            paceToSpeed(pace) {
                if (pace) {
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
            speedToPace(speed) {
                if (speed) {
                    let pace = 60 / this.formatSpeed(speed);
                    let minutes = pace | 0;
                    let seconds = Math.round(((pace % 1) * 60) | 0);
                    seconds = seconds < 10 && seconds ? '0' + seconds : seconds;
                    seconds = !seconds ? "00" : seconds;
                    return minutes + ":" + seconds
                } else return "";


            },
            closeAddDistance() {
                this.addDistance = false;
                this.presetDistances = ""
            },
            closeRemoveDistance() {
                this.removeDistance = false;
                this.presetDistances = ""
            },
            increment(field, ref = null) {
                if (this[field]) {
                    if (typeof this[field] === 'string') {
                        this[field] = String(parseFloat(this[field].replace(",", ".")) + 1).replace(/[,.]/g, this.separator);
                    } else {
                        this[field] = String(this[field]++)
                    }
                } else {
                    this[field] = "1"
                }
                if (ref) {
                    this.$nextTick(() => {
                        this.$refs[ref].focus()
                    });
                }
                this.checkFields()
            },
            decrement(field, ref = null) {
                if (this[field] && this[field] >= 1) {
                    if (typeof this[field] === 'string') {
                        this[field] = String(parseFloat(this[field].replace(",", ".")) - 1).replace(/[,.]/g, this.separator);
                    } else {
                        this[field] = String(this[field]--)
                    }
                } else {
                    this[field] = "0"
                }
                if (ref) {
                    this.$nextTick(() => {
                        this.$refs[ref].focus()
                    });
                }
                this.checkFields()
            },
            unitChange(fieldType, unit) {
                // determine the source multiplier
                let src_multiplier = this.unitMultipliers.filter(unitMultiplier => unitMultiplier.type === this.unitMode)[0].multiplier;
                // commit a change of unit
                this.$store.commit('changeUnitMode', {fieldType, unit});
                // get the destination multiplier to convert speed / distance
                let dest_multiplier = this.unitMultipliers.filter(unitMultiplier => unitMultiplier.type === this.unitMode)[0].multiplier;
                this.speed = (this.formatSpeed(this.speed) * dest_multiplier) / src_multiplier || '';
                this.distance = (this.formatDistance(this.distance) * dest_multiplier) / src_multiplier || '';
            }
        },
        watch: {
            durationString(newVal, oldVal) {
                this.durationString = String(this.durationString);
                if (!this.durationString) {
                    if (this.calculatedField === 'speed') {
                        this.speed = '';
                        this.pace = '';
                    } else if (this.calculatedField === 'distance') {
                        this.distance = '';
                    }
                } else if (this.calculatedField !== 'duration') {
                    // removing faulty characters
                    this.durationString = this.durationString.replace(/[^0-9,.:hms]/g, '');
                    // removing leading zero(s)
                    this.durationString = this.durationString.replace(/^0*([1-9]*)/g, '$1');
                    // PATTERN DESCRIPTION
                    // ([0-9]?[0-9]([h:]|[h:]?$))?
                    // => hours between 0 and 99, followed by h, : or nothing, but following character required if not the end of input
                    // ([0-5]?[0-9]([m:]|[m:]?$))?
                    // => minutes between 0 and 59, followed by m, : or nothing, but following character required if not the end of input
                    // ([0-5]?[0-9]([s]?$))?
                    // => seconds between 0 and 59, followed by s or nothing
                    if (this.durationString.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?/g)) {
                        // if not exactly match
                        if (this.durationString.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?/g)[0] !== this.durationString) {
                            // check if a new unit h or m is added : 3 digits in string and newVal length > oldVal
                            if (this.durationString.match(/[0-9][0-5][0-9][m|s].*/g) && newVal.length > oldVal.length) {
                                let newCaracter;
                                if (this.durationString.includes('m') && !this.durationString.includes('h')) {
                                    newCaracter = 'h'
                                } else newCaracter = 'm';
                                // hours or minute adding
                                this.durationString = this.durationString.replace(/([0-9])([0-5][0-9][m|s].*)/g, '$1' + newCaracter + '$2');

                                this.$nextTick(() => {
                                    this.$refs['durationString'].setSelectionRange(this.durationString.indexOf(newCaracter), this.durationString.indexOf(newCaracter));
                                });
                                // check if a starting unit is deleted
                            } else if (this.durationString.match(/^[hms][0-5]?[0-9](.*|$)/g)) {
                                this.durationString = this.durationString.replace(/([hms])([0-5]?[0-9](.*|$))/g, '$2');
                                this.durationDisplayedUnit = oldVal.includes('h') ? 'm' : oldVal.includes('m') ? 's' : '';
                                this.$nextTick(() => {
                                    if (this.durationString && this.oneFieldMode) {
                                        this.$refs['durationString'].setSelectionRange(0, 0);
                                    }
                                });
                                // check if minutes are deleted by deleting 'm' : 3 / 4 digits followed by s or end of string
                            } else if (this.durationString.match(/[h]?[0-5]?[0-9][0-5][0-9](s|$)/g) && oldVal.includes('m') && !newVal.includes('m')) {
                                this.durationString = this.durationString.replace(/([h]?)([0-5]?[0-9])([0-5][0-9](s|$))/g, '$1$3' + this.durationDisplayedUnit);
                                this.$nextTick(() => {
                                    if (this.durationString.includes('h') && this.oneFieldMode) {
                                        this.$refs['durationString'].setSelectionRange(this.durationString.indexOf('h') + 1, this.durationString.indexOf('h') + 1);
                                    } else {
                                        this.$refs['durationString'].setSelectionRange(0, 0)
                                    }
                                });
                                // check if minutes are deleted by deleting digits : 'hm' or 'hs
                            } else if (this.durationString.match(/hm|ms/g) && newVal.length < oldVal.length) {
                                this.durationString = this.durationString.replace(/hm/, 'h');
                                this.durationString = this.durationString.replace(/ms/, 'm');
                                // check if hours are deleted
                            } else if (this.durationString.match(/[[0-9]?[0-9][0-5][0-9](m|s|$)/g) && oldVal.includes('h')) {
                                this.durationString = this.durationString.replace(/([0-9]?[0-9])([0-5][0-9](m|s|$))/g, '$2');
                                this.durationString = this.durationString.match(/[m|s]$/g) ? this.durationString : this.durationString + this.durationDisplayedUnit
                            } else if (this.durationString.match(/^[hms]$/g)) {
                                this.durationString = '';
                                this.durationDisplayedUnit = 'h'
                            } else {
                                this.durationString = oldVal
                            }
                        } else {
                            // formatting character for display
                            if ((this.durationString.match(/[h:]/g) || []).length === 1 && (this.durationString.match(/[ms]/g) || []).length === 0) {
                                this.durationDisplayedUnit = 'm'
                            } else if ((this.durationString.match(/[s]/g) || []).length === 1) {
                                this.durationDisplayedUnit = ''
                            } else if ((this.durationString.match(/[hm:]/g) || []).length >= 1) {
                                this.durationDisplayedUnit = 's'
                            } else {
                                this.durationDisplayedUnit = 'h'
                            }
                        }
                        // else cancelling the input
                    } else {
                        this.durationString = ''
                    }
                } else if (this.calculatedField === 'duration') {
                    // formatting character for display
                    this.durationDisplayedUnit = ''
                }
                if (this.calculatedField !== 'duration') {
                    this.$store.commit('setDuration', this.formatDuration(this.durationString))
                }
            },
            durationHours(newVal, oldVal) {
                this.durationHours = String(this.durationHours);

                // check a durationHours change only if it's not the calculated fields
                if (this.durationHours && this.calculatedField !== 'duration') {
                    if (this.durationHours.match(/([0-9]?[0-9])/g)) {
                        // if not exactly match
                        if (this.durationHours.match(/([0-9]?[0-9])/g)[0] !== this.durationHours) {
                            // cancelling the input
                            this.durationHours = oldVal
                        } else if (this.durationHours.match(/([0-9][0-9])/g) && this.$refs['minutes']) {
                            this.$refs['minutes'].focus();
                        }
                    }
                    // else : cancelling the input
                    else {
                        this.durationHours = oldVal
                    }
                }
                let duration = this.durationHours ? this.durationHours + 'h' : '';
                duration += this.durationMinutes ? this.durationMinutes + 'm' : '';
                duration += this.durationSeconds ? this.durationSeconds + 's' : '';
                if (this.calculatedField !== 'duration') {
                    this.$store.commit('setDuration', this.formatDuration(duration, 1))
                }
            },
            durationMinutes(newVal, oldVal) {
                this.durationMinutes = String(this.durationMinutes);
                // check a durationMinutes change only if it's not the calculated fields
                if (this.durationMinutes && this.calculatedField !== 'duration') {
                    if (this.durationMinutes.match(/([0-5]?[0-9])/g)) {
                        // if not exactly match
                        if (this.durationMinutes.match(/([0-5]?[0-9])/g)[0] !== this.durationMinutes) {
                            // cancelling the input
                            this.durationMinutes = oldVal
                        } else if (this.durationMinutes.match(/([0-5][0-9])/g)) {
                            if (!this.oneFieldMode && this.$refs['seconds']) {
                                this.$refs['seconds'].focus();
                            }
                        }
                    }
                    // else : cancelling the input
                    else {
                        this.durationMinutes = oldVal
                    }
                }
                let duration = this.durationHours ? this.durationHours + 'h' : '';
                duration += this.durationMinutes ? this.durationMinutes + 'm' : '';
                duration += this.durationSeconds ? this.durationSeconds + 's' : '';
                if (this.calculatedField !== 'duration') {
                    this.$store.commit('setDuration', (duration, 1))
                }
            },
            durationSeconds(newVal, oldVal) {
                this.durationSeconds = String(this.durationSeconds);
                // check a durationSeconds change only if it's not the calculated fields
                if (this.durationSeconds && this.calculatedField !== 'duration') {
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
                let duration = this.durationHours ? this.durationHours + 'h' : '';
                duration += this.durationMinutes ? this.durationMinutes + 'm' : '';
                duration += this.durationSeconds ? this.durationSeconds + 's' : '';
                if (this.calculatedField !== 'duration') {
                    this.$store.commit('setDuration', (duration, 1));
                }
            },
            distance(newVal, oldVal) {
                this.distance = String(this.distance);
                if (this.$store.state.defaultDistances.find(defaultDist =>
                    defaultDist.distance === this.distance)) {
                    this.presetDistances = this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.distance === this.distance).label;
                } else {
                    this.presetDistances = ""
                }

                if (!this.distance) {
                    if (this.calculatedField === 'speed') {
                        this.speed = '';
                        this.pace = ''
                    } else if (this.calculatedField === 'duration') {
                        this.$store.commit('setDuration', '')
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
                    if (this.distance.match(/\d{0,9}([.,]\d{0,4})?/g)) {
                        // if not exactly match
                        if (this.distance.match(/\d{0,9}([.,]\d{0,4})?/g)[0] !== this.distance) {
                            // if too much decimals
                            if (this.distance.match(/\d+([.,]\d*)?/g)) {
                                this.distance = String(parseFloat(parseFloat(this.distance).toFixed(4)));
                                // else cancelling the input
                            } else {
                                // cancelling the input
                                this.distance = oldVal
                            }

                        }
                        // else : cancelling the input
                    } else {
                        this.distance = oldVal
                    }
                }
            },
            speed(newVal, oldVal) {
                this.speed = String(this.speed);
                if (!this.speed) {
                    this.pace = '';
                    if (this.calculatedField === 'duration') {
                        this.$store.commit('setDuration', '')
                    } else if (this.calculatedField === 'distance') {
                        this.distance = ''
                    }
                } else if (this.calculatedField !== 'speed') {
                    // removing faulty characters
                    this.speed = this.speed.replace(/[^0-9,.]/g, '');

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
                            // if too much decimals
                            if (this.speed.match(/\d+([.,]\d*)?/g)) {
                                this.speed = String(parseFloat(parseFloat(this.speed).toFixed(4)));
                                // else cancelling the input
                            } else {
                                this.speed = oldVal
                            }
                        }
                        // else : cancelling the input
                    } else {
                        this.speed = oldVal
                    }
                }
                if (this.speedFormat === 'pace') {
                    this.pace = this.speedToPace(this.speed)
                }
            },
            pace(newVal, oldVal) {
                this.pace = String(this.pace);
                if (!this.pace) {
                    if (this.calculatedField === 'speed') {
                        this.speed = '';
                        this.pace = '';
                    } else if (this.calculatedField === 'duration') {
                        this.durationString = ''
                    } else if (this.calculatedField === 'distance') {
                        this.distance = ''
                    }
                    this.speed = "";
                }

                if (this.pace && this.calculatedField !== "speed") {
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
                    if (this.speedFormat === 'speed') {
                        this.speed = this.paceToSpeed(this.pace)
                    }
                }
            },
            presetDistances(newVal) {
                if (newVal === "addDistance") {
                    this.addDistance = true;
                    this.presetDistances = ""
                }
                if (newVal === "removeDistance") {
                    this.removeDistance = true;
                    this.presetDistances = ""
                }
                if (this.calculatedField !== 'distance' && this.presetDistances) {
                    this.distance = this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.label === this.presetDistances).distance || 0;
                }
            },
            oneFieldMode() {
                this.$store.commit('setOneFieldMode', this.oneFieldMode);
                if (!this.oneFieldMode) {
                    this.durationHours = this.formatDuration(prettyDuration(this.duration, 3), 3).hours;
                    this.durationMinutes = this.formatDuration(prettyDuration(this.duration, 3), 3).minutes;
                    this.durationSeconds = this.formatDuration(prettyDuration(this.duration, 3), 3).seconds;
                } else {
                    this.durationString = prettyDuration(this.duration, true);
                }
            },
            separator(newVal) {
                localStorage.separator = newVal;
            },
            handleCheckFields() {
                this.checkFields()
            }
        },
        mounted() {
            this.separator = localStorage.separator || '.';
            this.oneFieldMode = localStorage.oneFieldMode ? JSON.parse(localStorage.oneFieldMode) : false;

            if (localStorage.speedFormat) {
                this.speedFormat = localStorage.speedFormat;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-box {
      @apply rounded-none mt-2 w-full sm:mb-2 md:rounded-lg md:m-2 lg:rounded-lg lg:my-4 lg:shadow-xl xl:rounded-lg xl:my-4 xl:shadow-xl filter backdrop-filter	backdrop-blur-md ;
      transition: all 0.5s;
      background-color: rgba($ma-secondary, 0.2);
      background-image: linear-gradient(171.8deg, rgba($ma-secondary, .8) 13.5%, rgba(#D17E00, 0.8) 78.6%);
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
        border-radius: 7px 7px 0 7px;
        color: $ma-primary;
        font-size: 1.1em;
        transition: all .3s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 40px;
        @apply bg-white mt-2 ml-3 mr-3 p-3 items-center;

    }

    .box:hover(:not(calculated)) {
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    }

    .icon {
        width: 20px;
        align-self: flex-start;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .calculated {
        background-color: $ma-primary;
        color: white;
        font-weight: 800;
        transition: all 0.2s;
        @apply ml-3 mt-2 shadow-lg;
    }

    input {
        @apply font-bold text-xl bg-transparent;

        &::placeholder {
            @apply font-light;
        }
    }

    input:focus {
        outline: none;
    }

    select {
        background-color: rgba(0, 0, 0, 0.0);
        text-align: center;
        font-size: 1em;
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

    .clear-fields-button {
        margin-left: 0.10em;
        transition: all .1s ease-in-out;
        cursor: pointer;

        &:hover {
            transform: scale(1.05);
        }
    }

    .calculated-label {
        color: $ma-primary;
    }

    .duration-display-switch {
        position: relative;
        z-index: 0;
    }

    .dot {
        width: 5px;
        height: 5px;
        position: absolute;
        left: calc(50% - 2.5px);
        transition: 500ms;
    }

    .dot1threeFieldsMode {
        width: 5px;
        height: 5px;
        position: absolute;
        left: calc(20% - 2.5px);
        transition: 500ms;
    }

    .dot3threeFieldsMode {
        width: 5px;
        height: 5px;
        position: absolute;
        left: calc(80% - 2.5px);
        transition: 500ms;
    }

    .preset-distances {
        transition: all 1s;
    }


    .number-input {
        &::-webkit-inner-spin-button {
            display: none;
        }

        -moz-appearance: textfield;

    }

    .box-option {
        @apply mr-3 px-2 self-end items-center rounded-b-lg shadow-lg
        flex cursor-pointer;
        transition: all 200ms ease-in;

        &:not(active) {
            @apply bg-primary;
        }

        &.active {
            @apply bg-white text-primary;
        }

        &:hover {
            padding-top: 5px;
        }
    }

    .icon-active {
        filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
    }

</style>
