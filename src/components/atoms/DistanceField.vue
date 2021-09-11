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

export default {
    name: "DistanceField",
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
        ...mapState(["unitMultipliers", "unitMode", "distanceUnit", "distanceUnits"]),
        distanceAsString: {
            get() {
                return this.value.toString()
            },
            set(val) {
                this.$emit('input', parseFloat(val))
            }
        }
    },
    methods: {
        increment(field, ref = null) {
            if (this[field]) {
                if (typeof this[field] === 'string') {
                    this[field] = String(parseFloat(this[field].replace(",", ".")) + 1);
                } else {
                    this[field] = String(this[field]++)
                }
            } else {
                this[field] = "1"
            }
            if (ref) {
                this.$nextTick(() => {
                    this.$refs[ref].focus()
                });
            }
        },
        decrement(field, ref = null) {
            if (this[field] > 0) {
                if (typeof this[field] === 'string') {
                    this[field] = String(parseFloat(this[field].replace(",", ".")) - 1);
                } else {
                    this[field] = String(this[field]--)
                }
            } else {
                this[field] = "0"
            }
            if (ref) {
                this.$nextTick(() => {
                    this.$refs[ref].focus()
                });
            }
        },
        unitChange(fieldType, unit) {
            this.$store.commit('changeUnitMode', {
                fieldType, 
                unit
            });
        },
        closeAddDistance() {
            this.addDistance = false
            this.presetDistances = ""
        },
        closeRemoveDistance() {
            this.removeDistance = false;
            this.presetDistances = ""
        },
    },
    watch: {
        distanceAsString (newVal, oldVal) {
            if (this.$store.state.defaultDistances.find(defaultDist =>
                defaultDist.distance === this.value )) {
                this.presetDistances = this.$store.state.defaultDistances.find(defaultDist =>
                    defaultDist.distance === this.value ).label;
            } else {
                this.presetDistances = ""
            }

            if (!this.value ) {
                if (this.isCalculated) {
                    this.speed = '';
                    this.pace = ''
                } else if (!this.isCalculated) {
                    // check leading zero is followed by zero or , / .
                    if (this.value.match(/^0{2,}(?![.,])/g)) {
                        // if yes : cancelling the input
                        this.$emit('input', oldVal)
                    }
                    // removing all others leading zeros by
                    this.$emit('input', this.value.replace(/^0([0-9]+)/g, '$1'))

                    // if distance matches at least partially with the pattern ?
                    if (this.value .match(/\d{0,9}([.,]\d{0,4})?/g)) {
                        // if not exactly match
                        if (this.value .match(/\d{0,9}([.,]\d{0,4})?/g)[0] !== this.value ) {
                            // if too much decimals
                            if (this.value .match(/\d+([.,]\d*)?/g)) {
                                this.$emit('input', String(parseFloat(parseFloat(this.value ).toFixed(4))))
                                // else cancelling the input
                            } else {
                                // cancelling the input
                                this.$emit('input', oldVal)
                            }
                        }  
                        // else : cancelling the input
                    } else {
                        this.$emit('input', oldVal)
                    }
                }
            }
        },
        presetDistances(newVal) {
            if (newVal === "addDistance") {
                this.addDistance = true;
                this.presetDistances = ""
            }
            if (newVal === "removeDistance") {
                this.removeDistance = true;
                this.presetDistances = ""
            }
            if (!this.calculated && this.presetDistances) {
                this.$emit('input', this.$store.state.defaultDistances.find(defaultDist =>
                    defaultDist.label === this.presetDistances).distance || 0)
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
        @apply mr-3 px-2 self-end items-center rounded-b-lg shadow-lg
        flex cursor-pointer;
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