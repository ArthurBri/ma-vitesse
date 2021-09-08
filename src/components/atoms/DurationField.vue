<template>
    <div class="flex flex-col h-24 noselect-nodrag ">
        <div :class="isCalculated && 'calculated noselect-nodrag'"
                class="box self-stretch justify-between shadow-md">
            <label @click="focusMe('duration')" for="durationString">{{ $t('calculator.duration') }}</label>
            <div class="w-40">
                <!-- ONE FIELD mode -->
                <div class="one-field-mode flex justify-end" v-if="oneFieldMode">
                    <!-- Field for 1 field mode -->
                    <input :disabled="isCalculated" @focus="focusMe('durationString')"
                            autocomplete="off"
                            class="w-28 text-right pr-1" id="durationString" ref="durationString"
                            v-model="durationString"/>
                    <span class="noselect-nodrag self-center">{{ durationDisplayedUnit }}</span>
                </div>
                <!-- THREE FIELDS mode -->
                <div class="flex justify-end" v-else>
                    <label>
                        <!-- Fields for 3 fields mode -->
                        <input :disabled="isCalculated"
                                class="w-10 pl-1 pr-1 text-center number-input"
                                :placeholder="[isCalculated ? '' : 'hh']"
                                @keydown.delete.left.right="updateCursor('hours',$event)"
                                @keydown.down="decrement('durationHours', 'hours')" autocomplete="off"
                                @keydown.up="increment('durationHours', 'hours')" ref="hours"
                                inputmode="numeric" pattern="[0-9]*" v-model="durationHours"/>
                        <span class="noselect-nodrag self-center">:</span>
                        <input :disabled="isCalculated"
                                class="w-10 pl-1 pr-1 ml-1 mr-1 text-center number-input"
                                :placeholder="[isCalculated ? '' : 'mm']"
                                @keydown.delete.left.right="updateCursor('minutes',$event)"
                                autocomplete="off"
                                @keydown.down="decrement('durationMinutes', 'minutes')"
                                @keydown.up="increment('durationMinutes', 'minutes')" ref="minutes"
                                inputmode="numeric" pattern="[0-9]*" v-model="durationMinutes"/>
                        <span class="noselect-nodrag self-center">:</span>
                        <input :disabled="isCalculated"
                                class="w-10 pl-1 pr-1 text-center number-input"
                                :placeholder="[isCalculated ? '' : 'ss']"
                                @keydown.delete.left.right="updateCursor('seconds',$event)"
                                autocomplete="off"
                                @keydown.down="decrement('durationSeconds', 'seconds')"
                                @keydown.up="increment('durationSeconds', 'seconds')" ref="seconds"
                                inputmode="numeric" pattern="[0-9]*" v-model="durationSeconds"/>
                    </label>
                </div>
            </div>
        </div>
        <!-- SWITCH 1 field / 3 fields -->
        <div @click="oneFieldMode = !oneFieldMode"
                :class="isCalculated ? 'noselect-nodrag active' : ''"
                class="box-option relative w-12 noselect-nodrag">
            <div class="h-6">
                <svg :class="[oneFieldMode ? 'dot' : 'dot1threeFieldsMode']" class="mt-2">
                    <rect :style="isCalculated ? 'fill:#2C629D' : 'fill:white'" height="5"
                            rx="2" ry="2" width="5"
                            x="0"
                            y="0"/>
                </svg>
                <svg :class="[oneFieldMode ? 'dot' : 'dot']" class="mt-2">
                    <rect :style="isCalculated ? 'fill:#2C629D' : 'fill:white'" height="5"
                            rx="2" ry="2" width="5"
                            x="0"
                            y="0"/>
                </svg>
                <svg :class="[oneFieldMode ? 'dot' : 'dot3threeFieldsMode']" class="mt-2">
                    <rect :style="isCalculated ? 'fill:#2C629D' : 'fill:white'" height="5"
                            rx="2" ry="2" width="5"
                            x="0"
                            y="0"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
    import {prettyDuration} from "@/utils/formatData"

export default {
    name: "DurationField",
    data () {
        return {
            oneFieldMode: false,
            durationString: '',
            durationDisplayed: '',
            durationDisplayedUnit: 'h',
            durationHours: '',
            durationMinutes: '',
            durationSeconds: '',
        }
    },
    props: {
        isCalculated: {
            type: Boolean,
            default: false
        }
    },
    methods: {
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
        focusMe(field) {
            if (this.oneFieldMode && field !== 'duration') {
                this.$refs["durationString"].focus()
            }
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
            }
    },
    watch: {
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
                    this.duration = this.formatDuration(this.durationString);
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
                    this.duration = this.formatDuration(duration, 1);
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
                    this.duration = this.formatDuration(duration, 1);
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
                    this.duration = this.formatDuration(duration, 1);
                }
            },
            duration() {
                // if a field is calculated, dispatch duration value to other fields
                if (this.calculatedField) {
                    if (!this.oneFieldMode) {
                        this.durationHours = this.formatDuration(prettyDuration(this.duration, 3), 3).hours;
                        this.durationMinutes = this.formatDuration(prettyDuration(this.duration, 3), 3).minutes;
                        this.durationSeconds = this.formatDuration(prettyDuration(this.duration, 3), 3).seconds;
                    } else {
                        this.durationString = prettyDuration(this.duration, true);
                    }
                    if (this.calculatedField === 'duration') {
                        this.durationHours = parseFloat(this.durationHours) ? parseFloat(this.durationHours) < 10 ? '0' + this.durationHours : parseFloat(this.durationHours) : '00';
                        this.durationMinutes = parseFloat(this.durationMinutes) ? parseFloat(this.durationMinutes) < 10 ? '0' + this.durationMinutes : parseFloat(this.durationMinutes) : '00';
                        this.durationSeconds = parseFloat(this.durationSeconds) ? parseFloat(this.durationSeconds) < 10 ? '0' + this.durationSeconds : parseFloat(this.durationSeconds) : '00';
                    }
                } else {
                    // one field mode : dispatch to 3 other fields
                    if (this.oneFieldMode) {
                        this.durationHours = this.formatDuration(this.durationString, 3).hours || '';
                        this.durationMinutes = this.formatDuration(this.durationString, 3).minutes || '';
                        this.durationSeconds = this.formatDuration(this.durationString, 3).seconds || '';
                    } else {
                        this.durationString = prettyDuration(this.duration, true);
                    }
                }
            },    
    
    },
    computed: {
        duration: {
            get() {
                console.log('duration',this.$store.state.duration)
                return this.$store.state.duration
            },
            set(val) {
                this.$store.commit('setDuration', val)
            }
        }
    },
    mounted () {
        this.oneFieldMode = localStorage.oneFieldMode ? JSON.parse(localStorage.oneFieldMode) : false
    }
}
</script>

<style lang="scss">
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

    .calculated {
        background-color: $ma-primary;
        color: white;
        font-weight: 800;
        transition: all 0.2s;
        @apply ml-3 mt-2 shadow-lg;
    }

    .number-input {
        &::-webkit-inner-spin-button {
            display: none;
        }

        -moz-appearance: textfield;

    }

    input {
        @apply font-bold text-xl bg-transparent;

        &::placeholder {
            @apply font-light;
        }
    }
</style>
