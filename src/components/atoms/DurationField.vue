<template>
    <div class="flex flex-col h-24 noselect-nodrag ">
        <div :class="isCalculated && 'calculated noselect-nodrag'"
                class="box self-stretch justify-between shadow-md">
            <label @click="focusMe('duration')" for="durationAsString">{{ $t('calculator.duration') }}</label>
            <div class="w-40">
                <!-- ONE FIELD mode -->
                <div class="one-field-mode flex justify-end" v-if="oneFieldMode">
                    <!-- Field for 1 field mode -->
                    <input :disabled="isCalculated" @focus="focusMe('durationAsString')"
                            autocomplete="off"
                            class="w-28 text-right pr-1" id="durationAsString" ref="durationAsString"
                            v-model="durationAsString"/>
                    <span class="noselect-nodrag self-center">{{ durationDisplayUnit }}</span>
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
import { prettyDuration, formatDuration } from "@/utils/formatData"

export default {
    name: "DurationField",
    data () {
        return {
            oneFieldMode: false,
            durationAsString: '',
            durationDisplay: '',
            durationDisplayUnit: 'h',
            durationHours: '',
            durationMinutes: '',
            durationSeconds: '',
        }
    },
    props: {
        isCalculated: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number
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
                    this[field] = String(parseFloat(this[field].replace(",", ".")) - 1);
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
                this.$refs["durationAsString"].focus()
            }
        },
    },
    watch: {
         oneFieldMode() {
                this.$store.commit('setOneFieldMode', this.oneFieldMode);
                if (!this.oneFieldMode) {
                    const { hours, minutes, seconds } = formatDuration(prettyDuration(this.value, 3), 3)
                    this.durationHours = hours
                    this.durationMinutes = minutes
                    this.durationSeconds = seconds;
                } else {
                    this.durationAsString = prettyDuration(this.value, true);
                }
            },
         durationAsString(newVal, oldVal) {
                if (!this.isCalculated) {
                    // removing faulty characters
                    this.durationAsString = this.durationAsString.replace(/[^0-9,.:hms]/g, '');
                    // removing leading zero(s)
                    this.durationAsString = this.durationAsString.replace(/^0*([1-9]*)/g, '$1');
                    // PATTERN DESCRIPTION
                    // ([0-9]?[0-9]([h:]|[h:]?$))?
                    // => hours between 0 and 99, followed by h, : or nothing, but following character required if not the end of input
                    // ([0-5]?[0-9]([m:]|[m:]?$))?
                    // => minutes between 0 and 59, followed by m, : or nothing, but following character required if not the end of input
                    // ([0-5]?[0-9]([s]?$))?
                    // => seconds between 0 and 59, followed by s or nothing
                    if (this.durationAsString.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?/g)) {
                        // if not exactly match
                        if (this.durationAsString.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?/g)[0] !== this.durationAsString) {
                            // check if a new unit h or m is added : 3 digits in string and newVal length > oldVal
                            if (this.durationAsString.match(/[0-9][0-5][0-9][m|s].*/g) && newVal.length > oldVal.length) {
                                let newCaracter;
                                if (this.durationAsString.includes('m') && !this.durationAsString.includes('h')) {
                                    newCaracter = 'h'
                                } else newCaracter = 'm';
                                // hours or minute adding
                                this.durationAsString = this.durationAsString.replace(/([0-9])([0-5][0-9][m|s].*)/g, '$1' + newCaracter + '$2');

                                this.$nextTick(() => {
                                    this.$refs['durationAsString'].setSelectionRange(this.durationAsString.indexOf(newCaracter), this.durationAsString.indexOf(newCaracter));
                                });
                                // check if a starting unit is deleted
                            } else if (this.durationAsString.match(/^[hms][0-5]?[0-9](.*|$)/g)) {
                                this.durationAsString = this.durationAsString.replace(/([hms])([0-5]?[0-9](.*|$))/g, '$2');
                                this.durationDisplayUnit = oldVal.includes('h') ? 'm' : oldVal.includes('m') ? 's' : '';
                                this.$nextTick(() => {
                                    if (this.durationAsString && this.oneFieldMode) {
                                        this.$refs['durationAsString'].setSelectionRange(0, 0);
                                    }
                                });
                                // check if minutes are deleted by deleting 'm' : 3 / 4 digits followed by s or end of string
                            } else if (this.durationAsString.match(/[h]?[0-5]?[0-9][0-5][0-9](s|$)/g) && oldVal.includes('m') && !newVal.includes('m')) {
                                this.durationAsString = this.durationAsString.replace(/([h]?)([0-5]?[0-9])([0-5][0-9](s|$))/g, '$1$3' + this.durationDisplayUnit);
                                this.$nextTick(() => {
                                    if (this.durationAsString.includes('h') && this.oneFieldMode) {
                                        this.$refs['durationAsString'].setSelectionRange(this.durationAsString.indexOf('h') + 1, this.durationAsString.indexOf('h') + 1);
                                    } else {
                                        this.$refs['durationAsString'].setSelectionRange(0, 0)
                                    }
                                });
                                // check if minutes are deleted by deleting digits : 'hm' or 'hs
                            } else if (this.durationAsString.match(/hm|ms/g) && newVal.length < oldVal.length) {
                                this.durationAsString = this.durationAsString.replace(/hm/, 'h');
                                this.durationAsString = this.durationAsString.replace(/ms/, 'm');
                                // check if hours are deleted
                            } else if (this.durationAsString.match(/[[0-9]?[0-9][0-5][0-9](m|s|$)/g) && oldVal.includes('h')) {
                                this.durationAsString = this.durationAsString.replace(/([0-9]?[0-9])([0-5][0-9](m|s|$))/g, '$2');
                                this.durationAsString = this.durationAsString.match(/[m|s]$/g) ? this.durationAsString : this.durationAsString + this.durationDisplayUnit
                            } else if (this.durationAsString.match(/^[hms]$/g)) {
                                this.durationAsString = '';
                                this.durationDisplayUnit = 'h'
                            } else {
                                this.durationAsString = oldVal
                            }
                        } else {
                            // formatting character for display
                            if ((this.durationAsString.match(/[h:]/g) || []).length === 1 && (this.durationAsString.match(/[ms]/g) || []).length === 0) {
                                this.durationDisplayUnit = 'm'
                            } else if ((this.durationAsString.match(/[s]/g) || []).length === 1) {
                                this.durationDisplayUnit = ''
                            } else if ((this.durationAsString.match(/[hm:]/g) || []).length >= 1) {
                                this.durationDisplayUnit = 's'
                            } else {
                                this.durationDisplayUnit = 'h'
                            }
                        }
                        // else cancelling the input
                    } else {
                        this.durationAsString = ''
                    }
                } else if (this.isCalculated) {
                    // formatting character for display
                    this.durationDisplayUnit = ''
                }
                if (!this.isCalculated) {
                    this.$emit('input', formatDuration(this.durationAsString))
                }
            },
          durationHours(newVal, oldVal) {
                // check a durationHours change only if it's not the calculated fields
                if (this.durationHours && !this.isCalculated) {
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
                if (!this.isCalculated) {
                    this.$emit('input', formatDuration(duration, 1))
                }
            },
            durationMinutes(newVal, oldVal) {
                // check a durationMinutes change only if it's not the calculated fields
                if (this.durationMinutes && !this.isCalculated) {
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
                if (!this.isCalculated) {
                    this.$emit('input', formatDuration(duration, 1))
                }
            },
            durationSeconds(newVal, oldVal) {
                this.durationSeconds = String(this.durationSeconds);
                // check a durationSeconds change only if it's not the calculated fields
                if (this.durationSeconds && !this.isCalculated) {
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
                if (!this.isCalculated) {
                    this.$emit('input', formatDuration(duration, 1))
                }
            },
            value() {
                if (this.isCalculated) {
                    if (!this.oneFieldMode) {
                        const { hours, minutes, seconds } = formatDuration(prettyDuration(this.value, 3), 3)
                        this.durationHours = hours
                        this.durationMinutes = minutes
                        this.durationSeconds = seconds
                    } else {
                        this.durationAsString = prettyDuration(this.value, true);
                    }
                    if (this.isCalculated) {
                        this.durationHours = parseFloat(this.durationHours) ? parseFloat(this.durationHours) < 10 ? '0' + this.durationHours : parseFloat(this.durationHours) : '00';
                        this.durationMinutes = parseFloat(this.durationMinutes) ? parseFloat(this.durationMinutes) < 10 ? '0' + this.durationMinutes : parseFloat(this.durationMinutes) : '00';
                        this.durationSeconds = parseFloat(this.durationSeconds) ? parseFloat(this.durationSeconds) < 10 ? '0' + this.durationSeconds : parseFloat(this.durationSeconds) : '00';
                    }
                } else {
                    if (this.oneFieldMode) {
                        const { hours, minutes, seconds } = formatDuration(prettyDuration(this.value, 3), 3)
                        this.durationHours = hours
                        this.durationMinutes = minutes
                        this.durationSeconds = seconds
                    } else {
                        this.durationAsString = prettyDuration(this.value, true);
                    }
                }
            },    
    
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
        @apply font-bold text-xl bg-transparent outline-none;

        &::placeholder {
            @apply font-light;
        }
    }
</style>
