<template>
    <div class="flex flex-col h-24 noselect-nodrag ">
        <div :class="isCalculated && 'calculated noselect-nodrag'"
                class="box self-stretch justify-between">
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
                :class="isCalculated && 'noselect-nodrag active'"
                class="box-option relative w-12 noselect-nodrag">
            <div class="h-6">
                <svg :class="[oneFieldMode ? 'dot' : 'dot1threeFieldsMode']" class="mt-2">
                    <rect :style="isCalculated ? 'fill:#2C629D' : 'fill:white'" height="5"
                            rx="2" ry="2" width="5" x="0" y="0"/>
                </svg>
                <svg :class="[oneFieldMode ? 'dot' : 'dot']" class="mt-2">
                    <rect :style="isCalculated ? 'fill:#2C629D' : 'fill:white'" height="5"
                            rx="2" ry="2" width="5" x="0" y="0"/>
                </svg>
                <svg :class="[oneFieldMode ? 'dot' : 'dot3threeFieldsMode']" class="mt-2">
                    <rect :style="isCalculated ? 'fill:#2C629D' : 'fill:white'" height="5"
                            rx="2" ry="2" width="5" x="0" y="0"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import { prettyDuration, formatDuration } from "@/utils/formatData"
import { cleanDurationInput, isValidDuration, isValidHours, isValidMinutes, isValidSeconds } from "@/utils/validateData"
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
            if (["Backspace", "Delete", "ArrowLeft"].includes(event.key)) {
                if (ref === "minutes" && (this.minutes === "" || this.$refs.minutes.selectionStart === 0)) {
                    if (this.$refs.minutes.selectionStart === this.$refs.minutes.selectionEnd) {
                        event.preventDefault()
                        this.$refs.hours.focus()
                    }
                }
                if (ref === "seconds" && (this.seconds === "" || this.$refs.seconds.selectionStart === 0)) {
                    if (this.$refs.seconds.selectionStart === this.$refs.seconds.selectionEnd) {
                        event.preventDefault()
                        this.$refs.minutes.focus()
                    }
                }
            } else if (event.key === "ArrowRight") {
                if (ref === 'hours' && this.$refs[ref].selectionStart === this.hours.length) {
                    event.preventDefault();
                    this.$refs.minutes.setSelectionRange(0, 0)
                    this.$refs.minutes.focus()
                } else if (ref === 'minutes' && this.$refs[ref].selectionStart === this.minutes.length) {
                    event.preventDefault()
                    this.$refs.seconds.setSelectionRange(0, 0)
                    this.$refs.seconds.focus()
                }
            }
        },  
        focusMe(field) {
            this.oneFieldMode && field !== 'duration' && this.$refs.durationOneField.focus()
        },
        updateOneFieldDuration() {
            this.durationOneField = `${this.hours}h${this.minutes}m${this.seconds}s`
        },
        getDurationDisplayUnit(duration) {
            if ((duration.match(/[h:]/g) || []).length === 1 && (duration.match(/[ms]/g) || []).length === 0) {
                return 'm'
            } else if ((duration.match(/[s]/g) || []).length === 1) {
                return ''
            } else if ((duration.match(/[hm:]/g) || []).length > 0) {
                return 's'
            } else {
                return 'h'
            }
        }
    },
    watch: {
        oneFieldMode() {
            this.$store.commit('setOneFieldMode', this.oneFieldMode)
        },
        durationOneField(newVal, oldVal) {
            isValidDuration(newVal)
                ? this.$emit('input', parseFloat(this.durationOneField.replace(",", ".")))
                : this.speedAsString = cleanDurationInput(oldVal)

            // TODO: handle 'setSelectionRange' when duration field change
            this.durationDisplayUnit = this.getDurationDisplayUnit(this.durationOneField)
        },
        hours(newVal, oldVal) {
            if(!isValidHours(newVal)) {
                this.hours = oldVal
                return
            }
            this.updateOneFieldDuration()
        },
        minutes(newVal, oldVal) {
            if(!isValidMinutes(newVal)) {
                this.minutes = oldVal
                return
            }
            this.updateOneFieldDuration()
        },
        seconds(newVal, oldVal) {
            if(!isValidSeconds(newVal)) {
                this.seconds = oldVal
                return
            }
            this.updateOneFieldDuration()
        },
        value() {
            const { hours, minutes, seconds } = formatDuration(prettyDuration(this.value, true))

            this.hours = parseFloat(hours) ? parseFloat(hours) < 10 ? '0' + hours : parseFloat(hours) : '00'
            this.minutes = parseFloat(minutes) ? parseFloat(minutes) < 10 ? '0' + minutes : parseFloat(minutes) : '00'
            this.seconds = parseFloat(seconds) ? parseFloat(seconds) < 10 ? '0' + seconds : parseFloat(seconds) : '00'
            
            this.durationOneField = prettyDuration(this.value, true)
        },
    },
    mounted () {
        this.oneFieldMode = localStorage.oneFieldMode ? JSON.parse(localStorage.oneFieldMode) : false
    }
}
</script>

<style lang="scss" scoped>

.box-option {
    @apply mr-3 px-2 self-end items-center rounded-b-lg bg-primary flex cursor-pointer;
    transition: all 200ms ease-in;

    &.active {
        @apply bg-white text-primary;
    }
}

.dot, .dot1threeFieldsMode, .dot3threeFieldsMode {
    @apply absolute w-4 h-4 transition duration-300;
    left: calc(50% - 2.5px);
}

.dot1threeFieldsMode {
    left: calc(20% - 2.5px);
}

.dot3threeFieldsMode {
    left: calc(80% - 2.5px);
}

.calculated {
    background-color: $ma-primary;
    color: white;
    font-weight: 800;
    transition: all 0.2s;
    @apply ml-3 mt-2;
}

input {
    @apply font-bold text-xl bg-transparent outline-none;

    &::placeholder {
        @apply font-light;
    }
}
</style>
