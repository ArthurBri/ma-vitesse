<template>
    <div class="flex flex-col h-24 h-">
        <div :class="isCalculated && 'calculated noselect-nodrag'"
                class="box speed self-stretch justify-between shadow-md">
            <label @click="focusMe('speed')" class="w-16 sm:w-8 noselect-nodrag" for="speed"
                    v-if="speedFormat === 'speed'">
                {{ $t('calculator.speed') }}
            </label>
            <label @click="focusMe('speed')" class="w-16 sm:w-8 noselect-nodrag" for="paceAsString"
                    v-if="speedFormat === 'paceAsString'">
                {{ $t('calculator.pace') }}
            </label>
            <div class="flex w-48" style="flex: 0 0 50px">
                <div class="flex items-stretch justify-end" v-if="speedFormat === 'speed'">
                    <input :disabled="isCalculated" @focus="showPresetDistances = false"
                            autocomplete="off"
                            class="text-right pr-1 xs:w-20 w-32 number-input"
                            id="speed" inputmode="decimal" name="speed" pattern="[0-9,.]*" ref="speed"
                            @keydown.down="decrement('speedAsString')" @keydown.up="increment('speedAsString')"
                            v-model="speedAsString"/>
                    <label aria-label="Switch between speed units" for="speed-unit"/>
                    <select @change="unitChange('speed', $event.target.value)" id="speed-unit"
                            class="self-center text-right cursor-pointer" tabindex="-1">
                        <option :key="item.type" :value="item.type" v-for="item in speedUnits">
                            {{ item.short }}
                        </option>
                    </select>
                </div>
                <div class="flex items-stretch justify-end" v-if="speedFormat === 'pace'">
                    <input :disabled="isCalculated" @focus="showPresetDistances = false"
                            autocomplete="off"
                            class="text-right pr-1 xs:w-20 w-32" id="pace" name="speed"
                            ref="pace" v-model="paceAsString"/>
                    <label aria-label="Switch between pace units" for="pace-unit"/>
                    <select @change="unitChange('pace', $event.target.value)" id="pace-unit"
                            class="self-center text-right cursor-pointer" tabindex="-1" v-model="paceUnit">
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
import { isValidSpeed } from '../../utils/validateData'

export default {
    name: "SpeedField",
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
            speedAsString: this.value.toString(),
            paceAsString: ''
        }
    },
    computed: {
        ...mapState(["unitMultipliers", "unitMode", "speedUnit", "speedUnits", "paceUnit", "paceUnits"]),
        speedFormat: {
            get() {
                return this.$store.state.speedFormat
            },
            set(val) {
                this.$store.commit('setSpeedFormat', val)
            }
        },
    },
    methods: {
        changeSpeedFormat() {
            this.speedFormat = this.speedFormat === 'speed' ? 'pace' : 'speed'
            this.$store.commit('setSpeedFormat', this.speedFormat)
        },
        paceToSpeed(paceAsString) {
            if (!paceAsString) return

            const minutes = paceAsString.match(/(^\d{1,2})[:]?/g) ? paceAsString.match(/(\d{1,2})[:]?/)[1] : 0
            const seconds = paceAsString.match(/[:](\d{1,2})/g) ? paceAsString.match(/[:](\d{1,2})?/)[1] : 0
        
            const speed = 60 / (parseInt(minutes) + parseInt(seconds) / 60);
            return speed
        },
        speedToPace(speed) {
            if (!speed) return

            const paceAsString = 60 / this.formatSpeed(speed)
            const minutes = paceAsString || 0;

            let seconds = Math.round(((paceAsString % 1) * 60) | 0)
            seconds = seconds < 10 && seconds ? '0' + seconds : seconds === 0 ? "00" : seconds
            
            return `${minutes}:${seconds}`
        },
        unitChange(fieldType, unit) {
            this.$store.commit('changeUnitMode', {
                fieldType, 
                unit
            });
        },
        increment(field) {
            if (this[field]) {
                if (typeof this[field] === 'string') {
                    this[field] = String(parseFloat(this[field].replace(",", ".")) + 1);
                } else {
                    this[field] = String(this[field]++)
                }
            } else {
                this[field] = "1"
            }
        },
        decrement(field) {
            if (this[field] && this[field] > 0) {
                if (typeof this[field] === 'string') {
                    this[field] = String(parseFloat(this[field].replace(",", ".")) - 1);
                } else {
                    this[field] = String(this[field]--)
                }
            } else {
                this[field] = "0"
            }
        }
    },
    watch: {
        value () {
            this.speedAsString = this.value.toString()
        },
        speedAsString (newVal, oldVal) {
            if (isValidSpeed(newVal)) {
                this.$emit('input', parseFloat(this.speedAsString.replace(",", ".")))
            } else {
                this.speedAsString = oldVal
            }
        }, 
        paceAsString(newVal, oldVal) {
            if (this.paceAsString && !this.isCalculated) {
                // check leading zero is followed by zero, and not by =
                if (this.paceAsString.match(/^0{2,}(?![:])?/g)) {
                    // if yes : cancelling the input
                    this.paceAsString = oldVal;
                }
                // if paceAsString matches at least partially with the pattern ?
                if (this.paceAsString.match(/(\d{1,2}:(\d{1,2})?)|(:?\d{1,2})|:/g)) {
                    // if not exactly match
                    if (this.paceAsString.match(/(\d{1,2}:(\d{1,2})?)|(:?\d{1,2})|:/g)[0] !== this.paceAsString) {
                        // cancelling the input
                        this.paceAsString = oldVal
                    }
                    // else : cancelling the input
                } else {
                    this.paceAsString = oldVal
                }
                if (this.speedFormat === 'speed') {
                    this.speed = this.paceToSpeed(this.paceAsString)
                }
            }
        }
    }
}
</script>
