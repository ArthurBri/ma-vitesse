<template>
    <div class="flex flex-col justify-center items-center">
        <div class="flex flex-col" v-if="lastWorkouts.length">
            <div class="flex justify-between items-center pb-2 pr-2">
                <div class="flex items-center">
                    <p class="font-bold pl-4">{{ $t('share_ma.yourSuccesses') }}</p>
                    <p class="blink bg-red-700 text-white text-xs rounded-sm px-1 mx-2 self-center">
                        {{ $t('common.live') | capitalize }}
                    </p>
                </div>
                <button v-if="calculatedField && timeLimitOk" @click="shareWorkout" class="mv-btn bg-secondary text-white flex py-1 mr-4 gap-2">
                    <span>{{ $t('common.shareYours') }}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-share w-4 h-4 stroke-current text-white"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="6" r="3" />
                        <circle cx="18" cy="18" r="3" />
                        <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                        <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
                    </svg>
                </button>
            </div>

            <div class="flex items-center justify-center">
                <table class="border-gray-200 text-sm w-full lg:w-64 rounded-lg">
                    <tbody class="more-workouts z-10 rounded-lg">
                        <tr v-for="(lastWorkout, index) in lastWorkouts" :key="index.value">
                            <td>
                                <span :class="`flag-icon flag-icon-${lastWorkout.country}`" />
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
                                    class="h-4 text-center align-middle noselect-nodrag"
                                    alt="Rocket icon"
                                    src="../assets/icons/rocket.svg"
                                    v-if="lastWorkout.speed > 140"
                                />
                                <img
                                    class="h-4 text-center align-middle noselect-nodrag"
                                    alt="Bike icon"
                                    src="../assets/icons/bike.svg"
                                    v-if="lastWorkout.speed > 20 && lastWorkout.speed <= 40"
                                />
                                <img
                                    class="w-4 text-center align-middle noselect-nodrag"
                                    alt="Car icon"
                                    src="../assets/icons/car.svg"
                                    v-if="lastWorkout.speed > 40 && lastWorkout.speed <= 140"
                                />
                                <img
                                    class="w-4 text-center align-middle noselect-nodrag"
                                    alt="Run icon"
                                    src="../assets/icons/run.svg"
                                    v-if="lastWorkout.speed > 7 && lastWorkout.speed <= 20"
                                />
                                <img
                                    class="w-4 text-center align-middle noselect-nodrag"
                                    alt="Walk icon"
                                    src="../assets/icons/walk.svg"
                                    v-if="lastWorkout.speed <= 7"
                                />
                            </td>
                            <td class="text-center noselect-nodrag whitespace-nowrap">
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
import { mapState } from 'vuex'
import moment from 'moment'
import { toPrettyDuration, formatSpeed } from '../utils/formatData'
import { nanoid } from 'nanoid'
import { setDoc, doc, collection, getDocs, orderBy, limit, query } from 'firebase/firestore/lite'
import { getUserCountry } from '../core/country'

export default {
    name: 'SharedWorkouts',
    async mounted() {
        moment.locale(this.$i18n.locale)
        this.loadWorkouts()
        if (localStorage.getItem('lastSharedWorkout')) {
            this.lastSharedWorkout = localStorage.getItem('lastSharedWorkout')
        }

        // TODO : handle rate limit
    },
    data() {
        return {
            showAllWorkouts: false,
            lastWorkouts: [],
            lastSharedWorkout: '',
            timeLimitOk: true
        }
    },
    methods: {
        showMoreWorkouts() {
            if (this.lastWorkouts.length > 1) {
                this.showAllWorkouts = !this.showAllWorkouts
            }
        },
        async shareWorkout() {
            const id = nanoid()
            const country = await getUserCountry()

            await setDoc(doc(this.$db, 'workouts', id), {
                country,
                distance: this.distance,
                unit: this.unitMode,
                duration: this.duration,
                speed: this.speed,
                calculatedField: this.calculatedField,
                creationDate: new Date().toISOString(),
                type: 'public'
            })
            localStorage.setItem('lastSharedWorkout', Date.now())
            await this.loadWorkouts()
        },
        async loadWorkouts() {
            const workoutsCollection = collection(this.$db, 'workouts')
            const q = query(workoutsCollection, orderBy('creationDate', 'desc'), limit(5))
            const workoutSnapshot = await getDocs(q)

            this.lastWorkouts = workoutSnapshot.docs.map((doc) => doc.data())
        }
    },
    computed: {
        ...mapState(['distance', 'speed', 'duration', 'oneFieldMode', 'calculatedField', 'speedFormat', 'unitMode']),
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
            return value.toFixed(4).replace(/(\.0+|0+)$/, '')
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

.blink {
    animation: blinking 4000ms infinite;
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
</style>
