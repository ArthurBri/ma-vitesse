<template>
    <div class="main-box flex-grow-0 p-6 m-4 xs:ml-0 xs:mr-0 sm:mr-0 sm:ml-0 xs:m-0 xs:pl-0 xs:pr-0 xs:w-full sm:w-full text-white overflow-x-auto">
        <div class="flex h-8 mb-2 items-center content-center" v-if="!calculatedField">
            <img alt="calaculator icon" class="w-8 sm:ml-4 xs:ml-4 noselect-nodrag" src="../assets/icons/timer.svg"/>
            <h2 class="noselect-nodrag self-center pl-2 font-semibold xs:mr-4 sm:mr-4 xl:text-xl">
                {{ $t('calculator.description')}}</h2>
        </div>
        <div class="flex justify-between h-8 mb-2" v-else>
            <div class="flex">
                <img alt="timer icon" class="w-8 sm:ml-4 xs:ml-4 noselect-nodrag" src="../assets/icons/timer.svg"/>
                <div class="flex self-center pl-2 font-semibold sm:mr-4 ">
                    <h2 class="xl:text-xl" v-if="$i18n.locale === 'fr'">
                        <span>{{ $t('calculator.calculation_label')}}</span>
                        <span class="self-center font-semibold calculated-label">{{ $t('common.' + calculatedField + '_lc') }}</span>
                    </h2>
                    <h2 class="xl:text-xl" v-else> 
                        <span class="self-center font-semibold calculated-label">{{ $t('common.' + calculatedField) }}</span>
                        <span>{{ $t('calculator.calculation_label')}}</span>
                    </h2>
                    <span>
                        <img @click="clearFields" alt="clear field button"
                               class="h-2 noselect-nodrag clear-fields-button"
                               src="../assets/icons/cancel.svg"/>
                    </span>
                </div>
            </div>
            <div class="xs:mr-2">
                <share-social/>
            </div>
        </div>
        <div class="wrapper">
            <duration-field 
                v-model="duration"
                :isCalculated="calculatedField === 'duration'" />
            <distance-field
                v-model="distance"
                :isCalculated="calculatedField === 'distance'" />
            <speed-field 
                v-model="speed"
                :isCalculated="calculatedField === 'speed'" />
        </div>
        <share-m-a class="mt-4"/>
    </div>
</template>

<script>
import ShareMA from "@/components/ShareMA"
import ShareSocial from "@/components/ShareSocial"
import DurationField from './atoms/DurationField.vue'
import DistanceField from './atoms/DistanceField.vue'
import SpeedField from './atoms/SpeedField.vue'

import { mapState } from 'vuex'

function doubleBinding(propName, mutationName) {
    return {
        get() {
                return this.$store.state[propName]
            },
        set(val) {
            this.$store.commit(mutationName, val)
        }
    }
}

export default {
    name: "Calculator",
    components: {ShareMA, ShareSocial, DurationField, DistanceField, SpeedField },
    computed: {
        ...mapState(["paceUnit", "paceUnits"]),
        speed: doubleBinding('speed', 'setSpeed'),
        duration: doubleBinding('duration', 'setDuration'),
        speedFormat: doubleBinding('speedFormat', 'setSpeedFormat'),
        distance: doubleBinding('distance', 'setDistance'),
        calculatedField: doubleBinding('calculatedField', 'setCalculatedField'),
        handleCheckFields() {
            return [this.distance, this.duration, this.speed].join('')
        }
    },
    methods: {
        checkFields() {
            let isDistance = this.distance > 0
            let isDuration = this.duration > 0
            let isSpeed = this.speed > 0
            
            if (this.calculatedField && [this.distance, this.duration, this.speed].includes(0)) {
                this[this.calculatedField] = 0
                this.calculatedField = ''
                return
            }

            if (isDistance && isDuration && (!isSpeed || (isSpeed && this.calculatedField === 'speed'))) {
                this.calculatedField = 'speed'
                this.speed = this.distance / this.duration
            } else if (isDistance && isSpeed && (!isDuration || (isDuration && this.calculatedField === 'duration'))) {
                this.calculatedField = 'duration'
                this.duration = this.distance / this.speed
            } else if (isSpeed && isDuration && (!isDistance || (isDistance && this.calculatedField === 'distance'))) {
                this.calculatedField = 'distance'
                this.distance = this.speed * this.duration
            } else {
                this.calculatedField = ''
            }
        },
        clearFields() {
            this.duration = 0
            this.distance = 0
            this.speed = 0;
            this.calculatedField = ''
        },
    },
    watch: {
        handleCheckFields() {
            this.checkFields()
        }
    },
}
</script>

<style lang="scss" scoped>
.main-box {
    @apply rounded-none mt-2 w-full sm:mb-2 md:rounded-lg md:m-2 lg:rounded-lg lg:my-4 lg:shadow-xl xl:rounded-lg xl:my-4 xl:shadow-xl;
    background-color: rgba($ma-secondary, 0.8);
}

.wrapper {
    @apply flex flex-wrap flex-row items-center justify-center;
}

.box {
    @apply flex justify-between items-center text-primary bg-white mt-2 ml-3 mr-3 p-3;
    border-radius: 7px 7px 0 7px;
    font-size: 1.1em;
    min-height: 40px;
}

.box:hover(:not(calculated)) {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.icon {
    width: 20px;
    align-self: flex-start;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.calculated {
    @apply ml-3 mt-2 shadow-lg bg-primary text-white;
    font-weight: 800;
}

input {
    @apply font-bold text-xl bg-transparent outline-none;

    &::placeholder {
        @apply font-light;
    }
}

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

select:focus {
    outline: none;
}

h1 {
    font-size: 2.5em;
    text-align: center;
}

.clear-fields-button {
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
    }
}

.calculated-label {
    color: $ma-primary;
}


.number-input {
    &::-webkit-inner-spin-button {
        display: none;
    }
    -moz-appearance: textfield;
}

.box-option {
    @apply mr-3 px-2 self-end items-center rounded-b-lg shadow-lg flex cursor-pointer;

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

.icon-active {
    filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
}
</style>
