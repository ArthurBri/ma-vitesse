<template>
    <div class="flex flex-col h-24 mt-2 ml-3 mr-3">
        <div :class="isCalculated && 'calculated noselect-nodrag'" class="calculator-field speed self-stretch justify-between">
            <label @click="focusMe('speed')" class="w-16 sm:w-8 noselect-nodrag" for="speed" v-if="speedFormat === 'speed'">
                {{ $t('calculator.speed') }}
            </label>
            <label @click="focusMe('speed')" class="w-16 sm:w-8 noselect-nodrag" for="pace" v-if="speedFormat === 'pace'">
                {{ $t('calculator.pace') }}
            </label>
            <div class="flex">
                <div class="flex items-stretch justify-end" v-if="speedFormat === 'speed'">
                    <input
                        :disabled="isCalculated"
                        @focus="showPresetDistances = false"
                        autocomplete="off"
                        class="text-right pr-1 w-32"
                        data-form-type="text"
                        id="speed"
                        inputmode="decimal"
                        name="speed"
                        ref="speed"
                        @keydown.down="decrement('speedAsString')"
                        @keydown.up="increment('speedAsString')"
                        v-model="speedAsString"
                    />
                    <label aria-label="Switch between speed units" for="speed-unit" />
                    <select id="speed-unit" class="speed-unit-select" tabindex="-1" v-model="unitMode">
                        <option :key="item.type" :value="item.type" v-for="item in speedUnits">
                            {{ item.short }}
                        </option>
                    </select>
                </div>
                <div class="flex items-stretch justify-end" v-if="speedFormat === 'pace'">
                    <input
                        :disabled="isCalculated"
                        @focus="showPresetDistances = false"
                        autocomplete="off"
                        data-form-type="text"
                        class="text-right pr-1 w-32"
                        id="pace"
                        name="speed"
                        ref="pace"
                        v-model="pace"
                    />
                    <label aria-label="Switch between pace units" for="pace-unit" />
                    <select id="pace-unit" class="speed-unit-select" tabindex="-1" v-model="unitMode">
                        <option :key="item.type" :value="item.type" v-for="item in paceUnits">
                            {{ item.short }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div @click="changeSpeedFormat" class="box-option mt-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-switch-vertical w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="3 8 7 4 11 8" />
                <line x1="7" y1="4" x2="7" y2="13" />
                <polyline points="13 16 17 20 21 16" />
                <line x1="17" y1="10" x2="17" y2="20" />
            </svg>
            <span v-if="speedFormat === 'speed'">{{ $t('calculator.pace') }}</span>
            <span v-if="speedFormat === 'pace'">{{ $t('calculator.speed') }}</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import fieldOperations from '@/mixins/fieldOperations'
import { isValidSpeed, cleanSpeedInput, isValidPace } from '@/utils/validateData'
import { paceToSpeed, speedToPace } from '@/utils/formatData'

export default {
    name: 'SpeedField',
    mixins: [fieldOperations],
    props: {
        isCalculated: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number
        }
    },
    data() {
        return {
            pace: ''
        }
    },
    computed: {
        ...mapState(['unitMultipliers', 'unitMode', 'speedUnits', 'paceUnits']),
        speedAsString: {
            get() {
                return this.value !== 0 ? this.value.toFixed(4).replace(/(\.0+|0+)$/, '') : ''
            },
            set(val) {
                this.$emit('input', parseFloat(val || 0))
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
        unitMode: {
            get() {
                return this.$store.state.unitMode
            },
            set(val) {
                this.$store.commit('changeUnitMode', val)
            }
        },
    },
    methods: {
        changeSpeedFormat() {
            this.speedFormat = this.speedFormat === 'speed' ? 'pace' : 'speed'
            this.$nextTick(() => {
                if (this.speedFormat === 'pace') {
                    this.pace = speedToPace(this.value)
                } else {
                    this.speedAsString = String(paceToSpeed(this.pace || 0))
                }
            })
        }
    },
    watch: {
        speedAsString(newVal, oldVal) {
            this.speedAsString = cleanSpeedInput(newVal)
            if (!isValidSpeed(this.speedAsString)) {
                this.speedAsString = cleanSpeedInput(oldVal)
            }
        },
        pace(newVal, oldVal) {
            if (!isValidPace(newVal)) {
                this.pace = oldVal
            } else {
                this.speedAsString = String(paceToSpeed(this.pace || 0))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.speed-unit-select {
    @apply self-center text-right cursor-pointer bg-transparent;
}
</style>
