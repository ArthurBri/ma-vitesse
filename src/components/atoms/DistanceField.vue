<template>
    <div>
        <div class="flex flex-col h-24 noselect-nodrag">
                <div :class="isCalculated && 'calculated noselect-nodrag'"
                     class="box distance self-stretch justify-between shadow-md">
                    <label @click="focusMe('distance')" for="distance">{{ $t('calculator.distance') }}</label>
                    <div class="flex">
                        <input :disabled="isCalculated" @focus="showPresetDistances = true"
                               autocomplete="off" data-form-type="text"
                               class="text-right pr-1 number-input w-32" id="distance" name="distance" onblur=""
                               @keydown.down="decrement('distanceAsString')" @keydown.up="increment('distanceAsString')"
                               inputmode="decimal" pattern="[0-9,.]*"
                               ref="distanceAsString" v-model="distanceAsString"/>
                        <label aria-label="Switch between distance units" for="distance-unit"/>
                        <select @change="unitChange('distance', $event.target.value)" id="distance-unit"
                                class="self-center text-right cursor-pointer" tabindex="-1" v-model="distanceUnit">
                            <option :key="item.type" :value="item.type" v-for="item in distanceUnits">{{ item.type }}</option>
                        </select>
                    </div>
                </div>
                <label class="box-option preset-distances noselect-nodrag"
                       v-show="showPresetDistances">
                    <select class="cursor-pointer" tabindex="-1" v-model="presetDistances">
                        <option disabled value="">{{ $t('calculator.my_distances')}}</option>
                        <option :key="preset.label" :value="preset.label" v-for="preset in $store.state.defaultDistances">
                            {{ preset.label }}
                        </option>
                        <option class="text-italic appearance-none" value="addDistance">+ {{$t('common.add')}}</option>
                        <option class="text-italic appearance-none" v-if="this.$store.state.defaultDistances.length > 0"
                                value="removeDistance">- {{$t('common.delete')}}
                        </option>

                    </select>
                </label>
                <span class="h-8 pt-1 pb-1" v-show="!showPresetDistances"></span>
            </div>
        <AddPresetDistance @close="closeAddDistance" v-show="addDistance"/>
        <RemovePresetDistance @close="closeRemoveDistance" v-show="removeDistance"/>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AddPresetDistance from '@/components/AddPresetDistance'
import RemovePresetDistance from '@/components/RemovePresetDistance'
import fieldOperations from '@/mixins/fieldOperations'

export default {
    name: "DistanceField",
    mixins: [fieldOperations],
    components: { AddPresetDistance, RemovePresetDistance },
    data () {
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
        ...mapState(["unitMultipliers", "unitMode", "distanceUnit", "distanceUnits", "defaultDistances"]),
        distanceAsString: {
            get() {
                return this.value !== 0 ? this.value.toString() : ''
            },
            set(val) {
                this.$emit('input', parseFloat(val))
            }
        }
    },
    methods: {
        unitChange(fieldType, unit) {
            this.$store.commit('changeUnitMode', {
                fieldType, 
                unit
            })
        },
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
        },
    },
    watch: {
        distanceAsString () {
            const distanceInPresetsIndex = this.defaultDistances.findIndex(defaultDist => defaultDist.distance === this.value)
            this.presetDistances = distanceInPresetsIndex > -1 ? this.defaultDistances[distanceInPresetsIndex].label : ''
        },
        presetDistances(newVal) {
            if (newVal === "addDistance") {
                this.addDistance = true
                this.presetDistances = ""
            }
            if (newVal === "removeDistance") {
                this.removeDistance = true
                this.presetDistances = ""
            }
            
            if (!this.calculated && this.presetDistances) {
                this.$emit('input', this.defaultDistances.find(defaultDist => defaultDist.label === this.presetDistances).distance || 0)
            }
        },
    }
}
</script>

<style scoped lang="scss">
select {
    background-color: rgba(0, 0, 0, 0.0);
    text-align: center;
    font-size: 1em;
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';

    > option {
        color: $ma-primary;
        text-align: center;
    }
}

.box-option {
    @apply mr-3 px-2 self-end items-center rounded-b-lg shadow-lg flex cursor-pointer;
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

.preset-distances {
    transition: all 1s;
}

.calculated-label {
    color: $ma-primary;
}
</style>