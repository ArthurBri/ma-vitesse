<template>
    <div class="flex flex-col h-24 mt-2 ml-3 mr-3">
        <div :class="isCalculated && 'calculated noselect-nodrag'" class="box speed self-stretch justify-between">
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
                        class="text-right pr-1 w-32 number-input"
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
                    <select
                        id="speed-unit"
                        class="speed-unit-select"
                        tabindex="-1"
                        v-model="speedUnit"
                    >
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
                    <select
                        id="pace-unit"
                        class="speed-unit-select"
                        tabindex="-1"
                        v-model="paceUnit"
                    >
                        <option :key="item.type" :value="item.type" v-for="item in paceUnits">
                            {{ item.short }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div @click="changeSpeedFormat" class="box-option mt-2">
            <img
                :class="isCalculated && 'icon-active'"
                alt="switch between pace and speed"
                class="w-4 h-6 mr-1 cursor-pointer noselect-nodrag"
                src="../../assets/icons/arrows.svg"
            />
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
                this.$emit('input', parseFloat(val || 0))
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
        paceUnit: {
            get() {
                return this.$store.state.paceUnit
            },
            set(val) {
                this.$store.commit('changeUnitMode', val)
            }
        },
        speedUnit: {
            get() {
                return this.$store.state.speedUnit
            },
            set(val) {
                this.$store.commit('changeUnitMode', val)
            }
        }
    },
    methods: {
        changeSpeedFormat() {
            this.speedFormat = this.speedFormat === 'speed' ? 'pace' : 'speed'
            if (this.speedFormat === 'pace') {
                this.pace = speedToPace(this.value)
            } else {
                this.speedAsString = String(paceToSpeed(this.pace || 0))
            }
            this.$store.commit('setSpeedFormat', this.speedFormat)
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
                this.speedAsString = String(paceToSpeed(this.pace || 0))
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
