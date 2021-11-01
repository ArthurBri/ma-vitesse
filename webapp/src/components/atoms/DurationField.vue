<template>
    <div class="flex flex-col h-24 noselect-nodrag mt-2 ml-3 mr-3">
        <div :class="isCalculated && 'calculated noselect-nodrag'" class="calculator-field self-stretch justify-between">
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
                        :placeholder="!isCalculated ? 'hh' : '00'"
                        @keydown.delete.left.right="updateCursorThreeFields('hours', $event)"
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
                        :placeholder="!isCalculated ? 'mm' : '00'"
                        @keydown.delete.left.right="updateCursorThreeFields('minutes', $event)"
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
                        :placeholder="!isCalculated ? 'ss' : '00'"
                        @keydown.delete.left.right="updateCursorThreeFields('seconds', $event)"
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
        <div @click="oneFieldMode = !oneFieldMode" class="box-option relative w-16 mt-2">
            <div class="h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="dot" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" :stroke="!oneFieldMode && '#2c3e50'" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="4" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="dot" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="4" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="dot" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" :stroke="!oneFieldMode && '#2c3e50'" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="4" />
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
        },
        oneFieldMode: {
            get() {
                return this.$store.state.oneFieldMode
            },
            set(value) {
                this.$store.commit('setOneFieldMode', value)
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
        updateCursorThreeFields(ref, event) {
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
                event.preventDefault()
                if (ref === 'hours' && this.$refs[ref].selectionStart === this.hours.length) {
                    this.$refs.minutes.setSelectionRange(0, 0)
                    this.$refs.minutes.focus()
                } else if (ref === 'minutes' && this.$refs[ref].selectionStart === this.minutes.length) {
                    this.$refs.seconds.setSelectionRange(0, 0)
                    this.$refs.seconds.focus()
                }
            }
        },
        focusMe(field) {
            this.oneFieldMode && field !== 'duration' && this.$refs.durationOneField.focus()
        },
        updateOneFieldDuration() {
            this.durationOneField = 
                (this.hours?.length > 1 ? this.hours + 'h' : '') +
                (this.minutes ? this.minutes + 'm' : '') +
                (this.seconds ? this.seconds + 's' : '')
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
        duration() {
            this.durationDisplayUnit = this.getDurationDisplayUnit()
        },
        hours(newVal, oldVal) {
            if (!isValidHours(newVal)) {
                this.hours = oldVal || ''
                return
            }
            this.updateOneFieldDuration()
        },
        minutes(newVal, oldVal) {
            if (!isValidMinutes(newVal)) {
                this.minutes = oldVal || ''
                return
            }
            this.updateOneFieldDuration()
        },
        seconds(newVal, oldVal) {
            if (!isValidSeconds(newVal)) {
                this.seconds = oldVal || ''
                return
            }
            this.updateOneFieldDuration()
        },
        value() {
            const { hours, minutes, seconds } = formatDuration(toPrettyDuration(this.duration, true))

            this.hours = parseFloat(hours) || ''
            this.minutes = parseFloat(minutes) || ''
            this.seconds = parseFloat(seconds) || ''
        },
        durationOneField(newVal) {
            const { hours, minutes, seconds } = formatDuration(newVal)
            this.hours = hours || ''
            this.minutes = minutes || ''
            this.seconds = seconds || ''
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
    @apply w-4 h-4 transition duration-300;
}

input {
    @apply font-bold text-xl bg-transparent outline-none;

    &::placeholder {
        @apply font-light;
    }
}

.calculated {
    input::placeholder {
        @apply text-white font-bold;
    }
}
</style>
