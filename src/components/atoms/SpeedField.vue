<template>
    <div class="flex flex-col h-24 h-">
        <div :class="isCalculated && 'calculated noselect-nodrag'"
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
                <div class="flex items-stretch justify-end" v-if="speedFormat === 'speed'">
                    <input :disabled="isCalculated" @focus="showPresetDistances = false"
                            autocomplete="off"
                            class="text-right pr-1 w-32 number-input" data-form-type="text"
                            id="speed" inputmode="decimal" name="speed" pattern="[0-9,.]*" ref="speed"
                            @keydown.down="decrement('speedAsString')" @keydown.up="increment('speedAsString')"
                            v-model="speedAsString"/>
                    <label aria-label="Switch between speed units" for="speed-unit"/>
                    <select @change="unitChange('speed', $event.target.value)" id="speed-unit"
                            class="speed-unit-select" tabindex="-1">
                        <option :key="item.type" :value="item.type" v-for="item in speedUnits">
                            {{ item.short }}
                        </option>
                    </select>
                </div>
                <div class="flex items-stretch justify-end" v-if="speedFormat === 'pace'">
                    <input :disabled="isCalculated" @focus="showPresetDistances = false"
                            autocomplete="off" data-form-type="text"
                            class="text-right pr-1 w-32" id="pace" name="speed"
                            ref="pace" v-model="pace"/>
                    <label aria-label="Switch between pace units" for="pace-unit"/>
                    <select @change="unitChange('pace', $event.target.value)" id="pace-unit"
                            class="speed-unit-select" tabindex="-1" v-model="paceUnit">
                        <option :key="item.type" :value="item.type" v-for="item in paceUnits">{{ item.short }}</option>
                    </select>
                </div>
            </div>
        </div>
        <div :class="isCalculated && 'active noselect-nodrag'"
                @click="changeSpeedFormat"
                class="box-option noselect-nodrag">
            <img :class="isCalculated && 'icon-active'" alt="switch between pace and speed"
                    class="w-4 h-6 mr-1 cursor-pointer noselect-nodrag"
                    src="../../assets/icons/arrows.svg"/>
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
    name: "SpeedField",
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
    data () {
        return {
            pace: ''
        }
    },
    computed: {
        ...mapState(["unitMultipliers", "unitMode", "speedUnit", "speedUnits", "paceUnits"]),
        speedAsString: {
            get() {
                this.pace = speedToPace(this.value)
                return this.value !== 0 ? this.value.toString() : ''
            },
            set(val) {
                this.$emit('input', parseFloat(val.replace(",", ".")))
            }
        },
        speedFormat: {
            get() { return this.$store.state.speedFormat },
            set(val) { this.$store.commit('setSpeedFormat', val) }
        },
        paceUnit: {
            get() { return this.$store.state.paceUnit },
            set(val) { this.$store.commit('changeUnitMode', val) }
        },
    },
    methods: {
        changeSpeedFormat() {
            this.speedFormat = this.speedFormat === 'speed' ? 'pace' : 'speed'
            if (this.speedFormat === 'pace') {
                this.pace = speedToPace(this.value)
            } else {
                this.speedAsString = String(paceToSpeed(this.pace))
            }
            this.$store.commit('setSpeedFormat', this.speedFormat)
        },
        unitChange(fieldType, unit) {
            this.pace = speedToPace(this.value)
            this.$store.commit('changeUnitMode', {
                fieldType, 
                unit
            })
        }
    },
    watch: {
        speedAsString (newVal, oldVal) {
            if (isValidSpeed(newVal)) {
                this.$emit('input', parseFloat(this.speedAsString.replace(",", ".")))
            } else {
                this.speedAsString = cleanSpeedInput(oldVal)
            }
        }, 
        pace(newVal, oldVal) {
            if (isValidPace(newVal)) {
                this.speedAsString = String(paceToSpeed(this.pace || 0))
            } else {
                this.pace = oldVal
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