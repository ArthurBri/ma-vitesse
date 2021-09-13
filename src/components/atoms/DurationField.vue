<template>
    <div class="flex flex-col h-24 noselect-nodrag ">
        <div :class="isCalculated && 'calculated noselect-nodrag'"
                class="box self-stretch justify-between shadow-md">
            <label @click="focusMe('duration')" for="duration">{{ $t('calculator.duration') }}</label>
            <div class="w-40">
                <div v-if="oneFieldMode" class="one-field-mode flex justify-end">
                    <input :disabled="isCalculated" @focus="focusMe('durationOneField')"
                            autocomplete="off"
                            class="w-28 text-right pr-1" id="duration" ref="durationOneField"
                            v-model="durationOneField" data-form-type="text"/>
                    <span class="noselect-nodrag self-center">{{ durationDisplayUnit }}</span>
                </div>
                <div v-else class="flex justify-end">
                    <label>
                        <input :disabled="isCalculated"
                                class="w-10 pl-1 pr-1 text-center number-input"
                                :placeholder="[isCalculated ? '' : 'hh']"
                                @keydown.delete.left.right="updateCursor('hours',$event)"
                                @keydown.down="decrement('hours')" autocomplete="off" data-form-type="text"
                                @keydown.up="increment('hours')" ref="hours"
                                inputmode="numeric" pattern="[0-9]*" v-model="hours"/>
                        <span class="noselect-nodrag self-center">:</span>
                        <input :disabled="isCalculated"
                                class="w-10 pl-1 pr-1 ml-1 mr-1 text-center number-input"
                                :placeholder="[isCalculated ? '' : 'mm']"
                                @keydown.delete.left.right="updateCursor('minutes',$event)"
                                autocomplete="off"
                                @keydown.down="decrement('minutes')"
                                @keydown.up="increment('minutes')" ref="minutes" data-form-type="text"
                                inputmode="numeric" pattern="[0-9]*" v-model="minutes"/>
                        <span class="noselect-nodrag self-center">:</span>
                        <input :disabled="isCalculated"
                                class="w-10 pl-1 pr-1 text-center number-input"
                                :placeholder="[isCalculated ? '' : 'ss']"
                                @keydown.delete.left.right="updateCursor('seconds',$event)"
                                autocomplete="off"
                                @keydown.down="decrement('seconds', 'seconds')"
                                @keydown.up="increment('seconds', 'seconds')" ref="seconds" data-form-type="text"
                                inputmode="numeric" pattern="[0-9]*" v-model="seconds"/>
                    </label>
                </div>
            </div>
        </div>
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
import fieldOperations from '../../mixins/fieldOperations'

export default {
    name: "DurationField",
    mixins: [fieldOperations],
    data () {
        return {
            oneFieldMode: false,
            durationDisplayUnit: 'h',
            hours: '',
            minutes: '',
            seconds: '',
        }
    },
    computed: {
        durationOneField: {
            get() {
                return prettyDuration(this.value.toString(), true)
            },
            set(val) {
                this.$emit('input', parseFloat(val.replace(",", ".")))
            }
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
                if (ref === "minutes" && (this.minutes === "" || this.$refs['minutes'].selectionStart === 0)) {
                    if (this.$refs['minutes'].selectionStart === this.$refs['minutes'].selectionEnd) {
                        event.preventDefault()
                        this.$refs['hours'].focus()
                    }
                }
                if (ref === "seconds" && (this.seconds === "" || this.$refs['seconds'].selectionStart === 0)) {
                    if (this.$refs['seconds'].selectionStart === this.$refs['seconds'].selectionEnd) {
                        event.preventDefault()
                        this.$refs['minutes'].focus()
                    }
                }
            // to right management
            } else if (event.key === "ArrowRight") {
                if (ref === 'hours' && this.$refs[ref].selectionStart === this.hours.length) {
                    event.preventDefault();
                    this.$refs['minutes'].setSelectionRange(0, 0)
                    this.$refs['minutes'].focus()
                } else if (ref === 'minutes' && this.$refs[ref].selectionStart === this.minutes.length) {
                    event.preventDefault()
                    this.$refs['seconds'].setSelectionRange(0, 0)
                    this.$refs['seconds'].focus()
                }
            }
        },  
        decrement(field, ref = null) {
            if (this[field] && this[field] >= 1) {
                if (typeof this[field] === 'string') {
                    this[field] = String(parseFloat(this[field].replace(",", ".")) - 1)
                } else {
                    this[field] = String(this[field]--)
                }
            } else {
                this[field] = "0"
            }
            if (ref) {
                this.$nextTick(() => {
                    this.$refs[ref].focus()
                })
            }
            this.checkFields()
        },
        focusMe(field) {
            if (this.oneFieldMode && field !== 'duration') {
                this.$refs["durationOneField"].focus()
            }
        },
        updateOneFieldDuration() {
            this.durationOneField = `${this.hours}h${this.minutes}m${this.seconds}s`
        }
    },
    watch: {
        oneFieldMode() {
            this.$store.commit('setOneFieldMode', this.oneFieldMode)

        },
        durationOneField(newVal, oldVal) {
            if (!this.isCalculated) {
                // removing faulty characters
                this.durationOneField = this.durationOneField.replace(/[^0-9,.:hms]/g, '')
                // removing leading zero(s)
                this.durationOneField = this.durationOneField.replace(/^0*([1-9]*)/g, '$1')
                // PATTERN DESCRIPTION
                // ([0-9]?[0-9]([h:]|[h:]?$))?
                // => hours between 0 and 99, followed by h, : or nothing, but following character required if not the end of input
                // ([0-5]?[0-9]([m:]|[m:]?$))?
                // => minutes between 0 and 59, followed by m, : or nothing, but following character required if not the end of input
                // ([0-5]?[0-9]([s]?$))?
                // => seconds between 0 and 59, followed by s or nothing
                if (this.durationOneField.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?/g)) {
                    // if not exactly match
                    if (this.durationOneField.match(/([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?/g)[0] !== this.durationOneField) {
                        // check if a new unit h or m is added : 3 digits in string and newVal length > oldVal
                        if (this.durationOneField.match(/[0-9][0-5][0-9][m|s].*/g) && newVal.length > oldVal.length) {
                            let newCaracter;
                            if (this.durationOneField.includes('m') && !this.durationOneField.includes('h')) {
                                newCaracter = 'h'
                            } else newCaracter = 'm';
                            // hours or minute adding
                            this.durationOneField = this.durationOneField.replace(/([0-9])([0-5][0-9][m|s].*)/g, '$1' + newCaracter + '$2');

                            this.$nextTick(() => {
                                this.$refs['durationOneField'].setSelectionRange(this.durationOneField.indexOf(newCaracter), this.durationOneField.indexOf(newCaracter));
                            });
                            // check if a starting unit is deleted
                        } else if (this.durationOneField.match(/^[hms][0-5]?[0-9](.*|$)/g)) {
                            this.durationOneField = this.durationOneField.replace(/([hms])([0-5]?[0-9](.*|$))/g, '$2');
                            this.durationDisplayUnit = oldVal.includes('h') ? 'm' : oldVal.includes('m') ? 's' : '';
                            this.$nextTick(() => {
                                if (this.durationOneField && this.oneFieldMode) {
                                    this.$refs['durationOneField'].setSelectionRange(0, 0);
                                }
                            });
                            // check if minutes are deleted by deleting 'm' : 3 / 4 digits followed by s or end of string
                        } else if (this.durationOneField.match(/[h]?[0-5]?[0-9][0-5][0-9](s|$)/g) && oldVal.includes('m') && !newVal.includes('m')) {
                            this.durationOneField = this.durationOneField.replace(/([h]?)([0-5]?[0-9])([0-5][0-9](s|$))/g, '$1$3' + this.durationDisplayUnit);
                            this.$nextTick(() => {
                                if (this.durationOneField.includes('h') && this.oneFieldMode) {
                                    this.$refs['durationOneField'].setSelectionRange(this.durationOneField.indexOf('h') + 1, this.durationOneField.indexOf('h') + 1);
                                } else {
                                    this.$refs['durationOneField'].setSelectionRange(0, 0)
                                }
                            });
                            // check if minutes are deleted by deleting digits : 'hm' or 'hs
                        } else if (this.durationOneField.match(/hm|ms/g) && newVal.length < oldVal.length) {
                            this.durationOneField = this.durationOneField.replace(/hm/, 'h');
                            this.durationOneField = this.durationOneField.replace(/ms/, 'm');
                            // check if hours are deleted
                        } else if (this.durationOneField.match(/[[0-9]?[0-9][0-5][0-9](m|s|$)/g) && oldVal.includes('h')) {
                            this.durationOneField = this.durationOneField.replace(/([0-9]?[0-9])([0-5][0-9](m|s|$))/g, '$2');
                            this.durationOneField = this.durationOneField.match(/[m|s]$/g) ? this.durationOneField : this.durationOneField + this.durationDisplayUnit
                        } else if (this.durationOneField.match(/^[hms]$/g)) {
                            this.durationOneField = '';
                            this.durationDisplayUnit = 'h'
                        } else {
                            this.durationOneField = oldVal
                        }
                    } else {
                        // formatting character for display
                        if ((this.durationOneField.match(/[h:]/g) || []).length === 1 && (this.durationOneField.match(/[ms]/g) || []).length === 0) {
                            this.durationDisplayUnit = 'm'
                        } else if ((this.durationOneField.match(/[s]/g) || []).length === 1) {
                            this.durationDisplayUnit = ''
                        } else if ((this.durationOneField.match(/[hm:]/g) || []).length >= 1) {
                            this.durationDisplayUnit = 's'
                        } else {
                            this.durationDisplayUnit = 'h'
                        }
                    }
                    // else cancelling the input
                } else {
                    this.durationOneField = ''
                }
            } else if (this.isCalculated) {
                this.durationDisplayUnit = ''
            }
        },
        hours(newVal, oldVal) {
            // check a hours change only if it's not the calculated fields
            if (this.hours && !this.isCalculated) {
                if (String(this.hours).match(/([0-9]?[0-9])/g)) {
                    // if not exactly match
                    if (String(this.hours).match(/([0-9]?[0-9])/g)[0] !== String(this.hours)) {
                        // cancelling the input
                        this.hours = oldVal
                    } else if (String(this.hours).match(/([0-9][0-9])/g) && this.$refs['minutes']) {
                        this.$refs['minutes'].focus();
                    }
                }
                // else : cancelling the input
                else {
                    this.hours = oldVal
                }
            }

            this.updateOneFieldDuration()
        },
        minutes(newVal, oldVal) {
            if (this.minutes && !this.isCalculated) {
                if (String(this.minutes).match(/([0-5]?[0-9])/g)) {
                    if (String(this.minutes).match(/([0-5]?[0-9])/g)[0] !== String(this.minutes)) {
                        this.minutes = oldVal
                    } else if (String(this.minutes).match(/([0-5][0-9])/g)) {
                        if (!this.oneFieldMode && this.$refs['seconds']) {
                            this.$refs['seconds'].focus();
                        }
                    }
                }
                else {
                    this.minutes = oldVal
                }
            }
            this.updateOneFieldDuration()
        },
        seconds(newVal, oldVal) {
            // check a seconds change only if it's not the calculated fields
            if (this.seconds && !this.isCalculated) {
                if (String(this.seconds).match(/([0-5]?[0-9])/g)) {
                    // if not exactly match
                    if (String(this.seconds).match(/([0-5]?[0-9])/g)[0] !== this.seconds) {
                        this.seconds = oldVal
                    }
                }
                else {
                    this.seconds = oldVal
                }
            }
            this.updateOneFieldDuration()
        },
        value() {
            const { hours, minutes, seconds } = formatDuration(prettyDuration(this.value, true))

            this.hours = parseFloat(hours) ? parseFloat(hours) < 10 ? '0' + hours : parseFloat(hours) : '00'
            this.minutes = parseFloat(minutes) ? parseFloat(minutes) < 10 ? '0' + minutes : parseFloat(minutes) : '00';
            this.seconds = parseFloat(seconds) ? parseFloat(seconds) < 10 ? '0' + seconds : parseFloat(seconds) : '00';
            
            this.durationOneField = prettyDuration(this.value, true);
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
