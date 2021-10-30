<template>
    <div>
        <div class="flex flex-col h-24 noselect-nodrag mt-2 ml-3 mr-3">
            <div :class="isCalculated && 'calculated noselect-nodrag'" class="calculator-field distance">
                <label @click="focusMe('distance')" for="distance">{{ $t('calculator.distance') }}</label>
                <div class="flex">
                    <input
                        :disabled="isCalculated"
                        @focus="showPresetDistances = true"
                        autocomplete="off"
                        data-form-type="text"
                        class="text-right pr-1 number-input w-32"
                        id="distance"
                        name="distance"
                        onblur=""
                        @keydown.down="decrement('distanceAsString')"
                        @keydown.up="increment('distanceAsString')"
                        inputmode="decimal"
                        pattern="[0-9,.]*"
                        ref="distanceAsString"
                        v-model="distanceAsString"
                    />
                    <label aria-label="Switch between distance units" for="distance-unit" />
                    <select id="distance-unit" class="self-center text-right cursor-pointer" tabindex="-1" v-model="distanceUnit">
                        <option :key="item.type" :value="item.type" v-for="item in distanceUnits">
                            {{ item.type }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="box-option preset-distances mt-2" v-show="showPresetDistances">
                <select class="cursor-pointer" tabindex="-1" v-model="presetDistances">
                    <option disabled value="">
                        {{ $t('calculator.my_distances') }}
                    </option>
                    <option :key="preset.label" :value="preset.label" v-for="preset in $store.state.defaultDistances">
                        {{ preset.label }}
                    </option>
                    <option class="text-italic appearance-none" value="addDistance">+ {{ $t('common.add') }}</option>
                    <option class="text-italic appearance-none" v-if="this.$store.state.defaultDistances.length > 0" value="removeDistance">
                        - {{ $t('common.delete') }}
                    </option>
                </select>
            </div>
            <span class="h-8 pt-1 pb-1" v-show="!showPresetDistances"></span>
        </div>
        <AddPresetDistance @close="closeAddDistance" v-show="addDistance" />
        <RemovePresetDistance @close="closeRemoveDistance" v-show="removeDistance" />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AddPresetDistance from '@/components/AddPresetDistance.vue'
import RemovePresetDistance from '@/components/RemovePresetDistance.vue'
import fieldOperations from '@/mixins/fieldOperations'

export default {
    name: 'DistanceField',
    mixins: [fieldOperations],
    components: { AddPresetDistance, RemovePresetDistance },
    data() {
        return {
            presetDistances: '',
            showPresetDistances: false,
            addDistance: false,
            removeDistance: false
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
    computed: {
        ...mapState(['unitMultipliers', 'unitMode', 'distanceUnits', 'defaultDistances']),
        distanceAsString: {
            get() {
                return this.value !== 0 ? this.value.toFixed(4).replace(/(\.0+|0+)$/, '') : ''
            },
            set(val) {
                this.$emit('input', parseFloat(val || 0))
            }
        },
        distanceUnit: {
            get() {
                return this.$store.state.distanceUnit
            },
            set(val) {
                this.$store.commit('changeUnitMode', val)
            }
        }
    },
    methods: {
        closeAddDistance() {
            this.addDistance = false
            this.presetDistances = ''
        },
        closeRemoveDistance() {
            this.removeDistance = false
            this.presetDistances = ''
        },
        focusMe(field) {
            this.$refs[field].focus()
        }
    },
    watch: {
        distanceAsString() {
            const distanceInPresetsIndex = this.defaultDistances.findIndex((defaultDist) => defaultDist.distance === this.value)
            this.presetDistances = distanceInPresetsIndex > -1 ? this.defaultDistances[distanceInPresetsIndex].label : ''
        },
        presetDistances(newVal) {
            if (newVal === 'addDistance') {
                this.addDistance = true
                this.presetDistances = ''
            }
            if (newVal === 'removeDistance') {
                this.removeDistance = true
                this.presetDistances = ''
            }

            if (!this.calculated && this.presetDistances) {
                this.$emit('input', this.defaultDistances.find((defaultDist) => defaultDist.label === this.presetDistances).distance || 0)
            }
        }
    }
}
</script>

<style scoped lang="scss"></style>
