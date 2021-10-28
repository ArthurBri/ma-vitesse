<template>
    <div class="flex flex-col h-24 noselect-nodrag mt-2 ml-3 mr-3">
        <div :class="isCalculated && 'calculated noselect-nodrag'" class="box self-stretch justify-between">
            <label @click="focusMe('duration')" for="durationOneField">{{ $t('calculator.duration') }}</label>
            <div class="w-40">
                <div v-if="oneFieldMode" class="one-field-mode flex justify-end">
                    <input
                        :disabled="isCalculated"
                        @focus="focusMe('duration')"
                        autocomplete="off"
                        class="w-28 text-right pr-1"
                        id="durationOneField"
                        ref="durationOneField"
                        v-model="durationOneField"
                        data-form-type="text"
                    />
                    <span class="noselect-nodrag self-center">{{ durationDisplayUnit }}</span>
                </div>
                <div v-else class="flex justify-end">
                        <input
                            :disabled="isCalculated"
                            class="w-10 pl-1 pr-1 text-center number-input"
                            :placeholder="[isCalculated ? '' : 'hh']"
                            @keydown.delete.left.right="updateCursor('hours', $event)"
                            @keydown.down="decrement('hours')"
                            autocomplete="off"
                            data-form-type="text"
                            @keydown.up="increment('hours')"
                            ref="hours"
                            inputmode="numeric"
                            v-model="hours"
                        />
                        <span class="noselect-nodrag self-center">:</span>
                        <input
                            :disabled="isCalculated"
                            class="w-10 pl-1 pr-1 text-center number-input"
                            :placeholder="[isCalculated ? '' : 'mm']"
                            @keydown.delete.left.right="updateCursor('minutes', $event)"
                            autocomplete="off"
                            @keydown.down="decrement('minutes')"
                            @keydown.up="increment('minutes')"
                            ref="minutes"
                            data-form-type="text"
                            inputmode="numeric"
                            v-model="minutes"
                        />
                        <span class="noselect-nodrag self-center">:</span>
                        <input
                            :disabled="isCalculated"
                            class="w-10 pl-1 pr-1 text-center number-input"
                            :placeholder="[isCalculated ? '' : 'ss']"
                            @keydown.delete.left.right="updateCursor('seconds', $event)"
                            autocomplete="off"
                            @keydown.down="decrement('seconds', 'seconds')"
                            @keydown.up="increment('seconds', 'seconds')"
                            ref="seconds"
                            data-form-type="text"
                            inputmode="numeric"
                            v-model="seconds"
                        />
                </div>
            </div>
        </div>
        <div
            @click="oneFieldMode = !oneFieldMode"
            class="box-option relative w-12 mt-2"
        >
            <div class="h-6">
                <svg :class="[oneFieldMode ? 'dot' : 'dot-1']" class="mt-2">
                    <rect :style="{ fill: '#2C629D' }" height="5" rx="2" ry="2" width="5" x="0" y="0" />
                </svg>
                <svg :class="[oneFieldMode ? 'dot' : 'dot']" class="mt-2">
                    <rect :style="{ fill: '#2C629D' }"  height="5" rx="2" ry="2" width="5" x="0" y="0" />
                </svg>
                <svg :class="[oneFieldMode ? 'dot' : 'dot-3']" class="mt-2">
                    <rect :style="{ fill: '#2C629D' }"  height="5" rx="2" ry="2" width="5" x="0" y="0" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import { toPrettyDuration, toRawDuration, formatDuration } from '@/utils/formatData'
import { isValidHours, isValidMinutes, isValidSeconds } from '@/utils/validateData'
import fieldOperations from '../../mixins/fieldOperations'

export default {
    name: 'DurationField',
    mixins: [fieldOperations],
    data() {
        return {
            oneFieldMode: false,
            durationDisplayUnit: 'h',
            durationOneField: '',
            hours: '',
            minutes: '',
            seconds: ''
        }
    },
    computed: {
        duration: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
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
            if (['Backspace', 'Delete', 'ArrowLeft'].includes(event.key)) {
                if (ref === 'minutes' && (this.minutes === '' || this.$refs.minutes.selectionStart === 0)) {
                    if (this.$refs.minutes.selectionStart === this.$refs.minutes.selectionEnd) {
                        event.preventDefault()
                        this.$refs.hours.focus()
                    }
                }
                if (ref === 'seconds' && (this.seconds === '' || this.$refs.seconds.selectionStart === 0)) {
                    if (this.$refs.seconds.selectionStart === this.$refs.seconds.selectionEnd) {
                        event.preventDefault()
                        this.$refs.minutes.focus()
                    }
                }
            } else if (event.key === 'ArrowRight') {
                if (ref === 'hours' && this.$refs[ref].selectionStart === this.hours.length) {
                    event.preventDefault()
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
            this.oneFieldMode && field !== 'duration' && this.$refs.duration.focus()
        },
        updateOneFieldDuration() {
            this.durationOneField = `${this.hours}h${this.minutes}m${this.seconds}s`
            this.duration = toRawDuration(this.hours, this.minutes, this.seconds)
        },
        getDurationDisplayUnit() {
            if ((this.durationOneField.match(/[h:]/g) || []).length === 1 && (this.durationOneField.match(/[ms]/g) || []).length === 0) {
                return 'm'
            } else if ((this.durationOneField.match(/[s]/g) || []).length === 1) {
                return ''
            } else if ((this.durationOneField.match(/[hm:]/g) || []).length > 0) {
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
        duration() {
            this.durationDisplayUnit = this.getDurationDisplayUnit()
        },
        hours(newVal, oldVal) {
            if (!isValidHours(newVal)) {
                this.hours = oldVal
                return
            }
            this.updateOneFieldDuration()
        },
        minutes(newVal, oldVal) {
            if (!isValidMinutes(newVal)) {
                this.minutes = oldVal
                return
            }
            this.updateOneFieldDuration()
        },
        seconds(newVal, oldVal) {
            if (!isValidSeconds(newVal)) {
                this.seconds = oldVal
                return
            }
            this.updateOneFieldDuration()
        },
        value() {
            const { hours, minutes, seconds } = formatDuration(toPrettyDuration(this.value, true))

            this.hours = parseFloat(hours) ? (parseFloat(hours) < 10 ? '0' + hours : parseFloat(hours)) : '00'
            this.minutes = parseFloat(minutes) ? (parseFloat(minutes) < 10 ? '0' + minutes : parseFloat(minutes)) : '00'
            this.seconds = parseFloat(seconds) ? (parseFloat(seconds) < 10 ? '0' + seconds : parseFloat(seconds)) : '00'
        },
        durationOneField(newVal) {
            const { hours, minutes, seconds } = formatDuration(newVal)
            this.hours = hours
            this.minutes = minutes
            this.seconds = seconds
        }
    },
    mounted() {
        this.oneFieldMode = localStorage.oneFieldMode ? JSON.parse(localStorage.oneFieldMode) : false
    }
}
</script>

<style scoped lang="scss">
.dot,
.dot-1,
.dot-3 {
    @apply absolute w-4 h-4 transition duration-300;
    left: calc(50% - 2.5px);
}

.dot-1 {
    left: calc(20% - 2.5px);
}

.dot-3 {
    left: calc(80% - 2.5px);
}

input {
    @apply font-bold text-xl bg-transparent outline-none;

    &::placeholder {
        @apply font-light;
    }
}
</style>
