<template>
    <div class="flex flex-col items-center">
        <div class="flex flex-col" v-if="publicWorkouts.length">
            <div class="flex items-center pb-2">
                <p class="font-bold pl-4 text-lg">{{ $t('share_ma.publicWorkouts') }}</p>
            </div>

            <div class="flex items-center justify-center rounded-lg overflow-hidden">
                <table class="border-gray-200 text-sm w-full">
                    <tbody class="more-workouts z-10">
                        <tr v-for="(lastWorkout, index) in publicWorkouts" :key="index.value">
                            <td>
                                <span :class="`flag-icon flag-icon-${lastWorkout.country} rounded-sm`" />
                            </td>
                            <td class="noselect-nodrag">
                                <span class="font-bold">{{ lastWorkout.distance | formatDistance }} {{ lastWorkout.unit }}</span>
                                {{ $t('common.in') }}
                                <span class="font-bold">{{ lastWorkout.duration | toPrettyDuration(oneFieldMode) }}</span>
                                {{ $t('common.at') }}
                                <span class="font-bold">
                                    {{ lastWorkout.speed | formatSpeed(speedFormat) }}
                                    <span v-if="speedFormat === 'pace'">min/{{ lastWorkout.unit }}</span>
                                    <span v-else>{{ lastWorkout.unit }}/h</span>
                                </span>
                            </td>
                            <td class="align-middle">
                                <img
                                    class="h-4 text-center align-middle"
                                    alt="Rocket icon"
                                    src="../assets/icons/rocket.svg"
                                    v-if="lastWorkout.speed > 140"
                                />
                                <img
                                    class="h-4 text-center align-middle"
                                    alt="Bike icon"
                                    src="../assets/icons/bike.svg"
                                    v-if="lastWorkout.speed > 20 && lastWorkout.speed <= 40"
                                />
                                <img
                                    class="w-4 text-center align-middle"
                                    alt="Car icon"
                                    src="../assets/icons/car.svg"
                                    v-if="lastWorkout.speed > 40 && lastWorkout.speed <= 140"
                                />
                                <img
                                    class="w-4 text-center align-middle"
                                    alt="Run icon"
                                    src="../assets/icons/run.svg"
                                    v-if="lastWorkout.speed > 7 && lastWorkout.speed <= 20"
                                />
                                <img
                                    class="w-4 text-center align-middle"
                                    alt="Walk icon"
                                    src="../assets/icons/walk.svg"
                                    v-if="lastWorkout.speed <= 7"
                                />
                            </td>
                            <td class="text-center whitespace-nowrap">
                                {{ lastWorkout.creationDate | moment }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import { toPrettyDuration, formatSpeed, toDecimals } from '../utils/formatData'

export default {
    name: 'SharedWorkouts',
    async mounted() {
        moment.locale(this.$i18n.locale)
        this.loadWorkouts(this.$db)
        if (localStorage.getItem('lastSharedWorkout')) {
            this.lastSharedWorkout = localStorage.getItem('lastSharedWorkout')
        }

        // TODO : handle rate limit
    },
    data() {
        return {
            showAllWorkouts: false,
            lastSharedWorkout: '',
            timeLimitOk: true
        }
    },
    methods: {
        ...mapActions(['loadWorkouts'])
    },
    computed: {
        ...mapState(['distance', 'speed', 'duration', 'oneFieldMode', 'calculatedField', 'speedFormat', 'unitMode', 'publicWorkouts']),
        locale() {
            return this.$i18n.locale
        }
    },
    watch: {
        locale() {
            moment.locale(this.$i18n.locale)
        }
    },
    filters: {
        moment(date) {
            return moment(date).fromNow()
        },
        capitalize(value) {
            if (!value) return ''
            return value.toString().toUpperCase()
        },
        toPrettyDuration(value, oneFieldMode) {
            if (!value) return ''
            return toPrettyDuration(value, oneFieldMode)
        },
        formatSpeed(value, speedFormat) {
            if (!value) return ''
            return formatSpeed('' + value, speedFormat)
        },
        formatDistance(value) {
            if (!value) return ''
            return toDecimals(value, 2)
        }
    }
}
</script>

<style lang="scss" scoped>
td {
    @apply px-2 py-1;
}

.more-workouts {
    @apply rounded-b-lg text-primary overflow-hidden bg-white bg-opacity-80;
    transition: all 400ms linear;
}

@keyframes blinking {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.chevron {
    @apply h-4 cursor-pointer transform duration-200 ease-in-out;
}

@keyframes move-right {
    0% {
        transform: translateX(0px) rotate(-90deg);
    }
    50% {
        transform: translateX(5px) rotate(-90deg);
    }
    100% {
        transform: translateX(0px) rotate(-90deg);
    }
}

@keyframes move-bottom {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(5px);
    }
    100% {
        transform: translateY(0px);
    }
}

.chevron.animated {
    @apply rotate-0 transform;
    animation: move-bottom 2000ms infinite;
}

table {
    @apply overflow-auto;
}
</style>
