<template>
    <div class="main-box flex-grow-0 p-3 lg:p-6 lg:m-4 sm:w-full overflow-x-auto">
        <div class="flex h-8 items-center content-center max-w-screen-sm" v-if="!calculatedField">
            <img alt="calaculator icon" class="w-6 noselect-nodrag stroke-current text-secondary" src="../assets/icons/timer.svg" />
            <div class="pl-2 leading-none relative truncate">
                <h2 class="font-semibold text-lg lg:text-xl text-secondary">
                    {{ $t('calculator.description') }}
                </h2>
                <p class="text-xs">{{ $t('calculator.hint') }}</p>
            </div>
        </div>
        <div class="flex justify-between items-center h-8 mb-2" v-else>
            <div class="flex">
                <img alt="timer icon" class="w-8 noselect-nodrag" src="../assets/icons/timer.svg" />
                <div class="flex items-center pl-2 font-semibold mr-4 xl:text-xl relative">
                    <h2 class="flex gap-1" :class="$i18n.locale === 'fr' && 'flex-row-reverse'">
                        <div class="self-center font-semibold calculated-label">
                            {{ $t('common.' + calculatedField) | lowercase($i18n.locale === 'fr') }}
                        </div>
                        <div>{{ $t('calculator.calculation_label') }}</div>
                    </h2>
                    <button @click="clearFields" class="mv-btn-rounded">
                        <img alt="clear field button" class="h-2 clear-fields-button" src="../assets/icons/cancel.svg" />
                    </button>
                </div>
            </div>
            <div class="mr-2">
                <share-social />
            </div>
        </div>
        <div class="wrapper">
            <duration-field v-model="duration" :isCalculated="calculatedField === 'duration'" />
            <distance-field v-model="distance" :isCalculated="calculatedField === 'distance'" />
            <speed-field v-model="speed" :isCalculated="calculatedField === 'speed'" />
        </div>
    </div>
</template>

<script>
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
    },
    filters: {
        lowercase(value, apply) {
            if (!apply) return value
            return value.toLowerCase()
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

input {
    @apply font-bold text-xl bg-transparent outline-none;

    &::placeholder {
        @apply font-light;
    }
}

select {
    @apply bg-transparent text-center appearance-none;

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
    @apply text-secondary;
}
</style>
