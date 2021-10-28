<template>
    <div class="main-box flex-grow-0 p-6 m-4 sm:mr-0 sm:ml-0 sm:w-full overflow-x-auto">
        <div class="flex h-8 mb-2 items-center content-center" v-if="!calculatedField">
            <img alt="calaculator icon" class="w-8 sm:ml-4 noselect-nodrag stroke-current text-secondary" src="../assets/icons/timer.svg" />
            <h2 class="noselect-nodrag self-center pl-2 font-semibold sm:mr-4 text-2xl text-secondary">
                {{ $t('calculator.description') }}
            </h2>
        </div>
        <div class="flex justify-between h-8 mb-2" v-else>
            <div class="flex">
                <img alt="timer icon" class="w-8 noselect-nodrag" src="../assets/icons/timer.svg" />
                <div class="flex self-center pl-2 font-semibold sm:mr-4 xl:text-xl">
                    <h2 v-if="$i18n.locale === 'fr'">
                        <span>{{ $t('calculator.calculation_label') }}</span>
                        <span class="self-center font-semibold calculated-label">{{ $t('common.' + calculatedField + '_lc') }}</span>
                    </h2>
                    <h2 v-else>
                        <span class="self-center font-semibold calculated-label">{{ $t('common.' + calculatedField) }}</span>
                        <span>{{ $t('calculator.calculation_label') }}</span>
                    </h2>
                    <span>
                        <img
                            @click="clearFields"
                            alt="clear field button"
                            class="h-2 noselect-nodrag clear-fields-button"
                            src="../assets/icons/cancel.svg"
                        />
                    </span>
                </div>
            </div>
            <div class="xs:mr-2">
                <share-social />
            </div>
        </div>
        <div class="wrapper">
            <duration-field v-model="duration" :isCalculated="calculatedField === 'duration'" />
            <distance-field v-model="distance" :isCalculated="calculatedField === 'distance'" />
            <speed-field v-model="speed" :isCalculated="calculatedField === 'speed'" />
        </div>
        <share-m-a class="mt-4" />
    </div>
</template>

<script>
import ShareMA from '@/components/ShareMA.vue'
import ShareSocial from '@/components/ShareSocial.vue'
import DurationField from './atoms/DurationField.vue'
import DistanceField from './atoms/DistanceField.vue'
import SpeedField from './atoms/SpeedField.vue'

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
    name: 'Calculator',
    components: {
        ShareMA,
        ShareSocial,
        DurationField,
        DistanceField,
        SpeedField
    },
    computed: {
        speed: doubleBinding('speed', 'setSpeed'),
        duration: doubleBinding('duration', 'setDuration'),
        speedFormat: doubleBinding('speedFormat', 'setSpeedFormat'),
        distance: doubleBinding('distance', 'setDistance'),
        calculatedField: doubleBinding('calculatedField', 'setCalculatedField'),
        isDistance() {
            return this.distance > 0
        },
        isDuration() {
            return this.duration > 0
        },
        isSpeed() {
            return this.speed > 0
        }
    },
    methods: {
        calculate(field) {
            switch (field) {
                case 'speed':
                    this.speed = this.distance / this.duration
                    this.calculatedField = 'speed'
                    break
                case 'duration':
                    this.duration = this.distance / this.speed
                    this.calculatedField = 'duration'
                    break
                case 'distance':
                    this.distance = this.speed * this.duration
                    this.calculatedField = 'distance'
                    break

            }

        },
        clearFields() {
            this.duration = 0
            this.distance = 0
            this.speed = 0
            this.calculatedField = null
        }
    },
    watch: {
        speed(newSpeed) {
            if (this.calculatedField === 'speed') {
                return
            }

            if (newSpeed > 0) {
                this.isDuration && this.calculatedField !== 'duration' && this.calculate('distance')
                this.isDistance && this.calculatedField !== 'distance' && this.calculate('duration')
            } else if (newSpeed === 0) {
                this[this.calculatedField] = 0
                this.calculatedField = null
            }
        },
        distance(newDistance) {
            if (this.calculatedField === 'distance') {
                return
            }

            if (newDistance > 0) {
                this.isDuration && this.calculatedField !== 'duration' && this.calculate('speed')
                this.isSpeed && this.calculatedField !== 'speed' && this.calculate('duration')
            } else if (newDistance === 0) {
                this[this.calculatedField] = 0
                this.calculatedField = null
            }        
        },
        duration(newDuration) {
            if (this.calculatedField === 'duration') {
                return
            }

            if (newDuration > 0) {
                this.isSpeed && this.calculatedField !== 'speed' && this.calculate('distance')
                this.isDistance && this.calculatedField !== 'distance' && this.calculate('speed')
            } else if (newDuration === 0) {
                this[this.calculatedField] = 0
                this.calculatedField = null
            }        
        }
    }
}
</script>

<style lang="scss">
.main-box {
    @apply rounded-none mt-2 w-full sm:mb-2 md:rounded-lg md:m-2 lg:rounded-lg lg:my-4;
}

.wrapper {
    @apply flex flex-wrap flex-row items-center justify-center my-6;
}

.icon {
    width: 20px;
    align-self: flex-start;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
}

input {
    @apply font-bold text-xl bg-transparent outline-none;

    &::placeholder {
        @apply font-light;
    }
}

select {
    background-color: rgba(0, 0, 0, 0);
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


.icon-active {
    filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
}
</style>
