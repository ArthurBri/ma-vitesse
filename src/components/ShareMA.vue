<template>
    <div class="flex flex-col justify-center items-center mx-10 sm:mx-2 md:mx-4 lg:mx-2">
        <div v-if="calculatedField && timeLimitOk">
            <button @click="shareWorkout" class="mv-btn flex py-1 mr-4 sm:mb-2 md:mb-2">
                <span>{{ $t('common.share') }}</span>
                <img alt="Chevron to show more workouts" class="chevron animated self-center ml-2" src="../assets/icons/chevron.svg" />
            </button>
        </div>
        <div class="flex flex-col items-center" v-if="lastWorkouts.length">
            <div class="flex md:mb-2 sm:mb-2 lg:mb-1 xl:mb-1" v-if="!calculatedField || !timeLimitOk">
                <p>{{ $t('share_ma.last_workouts') }}</p>
                <p class="blink bg-red-700 text-white text-xs rounded-sm px-1 mx-2 self-center">
                    {{ $t('common.live') | capitalize }}
                </p>
            </div>
            <div class="flex items-center justify-center">
                <table class="show-workouts border-gray-200 text-sm">
                    <div
                        :class="[showAllWorkouts ? 'rounded-t-lg rounded-r-lg bg-white border text-primary' : 'rounded-lg border']"
                        @click="showMoreWorkouts"
                        class="bg-white animate flex justify-center cursor-pointer z-10"
                        :title="$t('share_ma.last_workouts')"
                    >
                        <tr>
                            <td class="align-middle">
                                <span
                                    :class="`flag-icon flag-icon-${lastWorkouts[0].country}`"
                                    v-if="lastWorkouts[0].country"
                                />
                            </td>
                            <td class="noselect-nodrag align-middle text-sm">
                                <b>{{ lastWorkouts[0].distance }} {{ lastWorkouts[0].unit }}</b>
                                {{ $t('common.in') }}
                                <b> {{ lastWorkouts[0].duration | toPrettyDuration(oneFieldMode) }}</b>
                                {{ $t('common.at') }}
                                <b>
                                    {{ lastWorkouts[0].speed | formatSpeed(speedFormat) }}
                                    <span v-if="speedFormat === 'pace'">min/{{ lastWorkouts[0].unit }}</span>
                                    <span v-else>{{ lastWorkouts[0].unit }}/h</span>
                                </b>
                            </td>
                            <td class="align-middle">
                                <img
                                    class="h-4 text-center align-middle noselect-nodrag"
                                    alt="Rocket icon"
                                    src="../assets/icons/rocket.svg"
                                    v-if="lastWorkouts[0].speed > 140"
                                />
                                <img
                                    class="h-4 text-center align-middle noselect-nodrag"
                                    alt="Bike icon"
                                    src="../assets/icons/bike.svg"
                                    v-if="lastWorkouts[0].speed > 20 && lastWorkouts[0].speed <= 40"
                                />
                                <img
                                    class="h-4 text-center align-middle noselect-nodrag"
                                    alt="Car icon"
                                    src="../assets/icons/car.svg"
                                    v-if="lastWorkouts[0].speed > 40 && lastWorkouts[0].speed < 140"
                                />
                                <img
                                    class="h-4 text-center align-middle noselect-nodrag"
                                    alt="Run icon"
                                    src="../assets/icons/run.svg"
                                    v-if="lastWorkouts[0].speed > 7 && lastWorkouts[0].speed <= 20"
                                />
                                <img
                                    class="h-4 text-center align-middle"
                                    alt="Walk icon"
                                    src="../assets/icons/walk.svg"
                                    v-if="lastWorkouts[0].speed <= 7"
                                />
                            </td>
                            <td class="text-sm align-middle noselect-nodrag whitespace-nowrap">
                                {{ lastWorkouts[0].creationDate | moment }}
                            </td>
                        </tr>
                        <div class="flex items-center self-center justify-center h-4 opacity-100 px-2" v-if="lastWorkouts.length > 1">
                            <img
                                :class="!showAllWorkouts && 'transform -rotate-90'"
                                alt="Chevron"
                                class="chevron noselect-nodrag"
                                src="../assets/icons/chevron.svg"
                            />
                        </div>
                    </div>
                    <div class="bg-primary" v-if="lastWorkouts.length > 1">
                        <tbody :class="[showAllWorkouts ? 'h-48 opacity-100' : 'h-0 opacity-25']" class="more-workouts show-workouts z-10">
                            <tr v-for="(lastWorkout, index) in lastWorkouts" :key="index.value">
                                <td>
                                    <span :class="`flag-icon flag-icon-${lastWorkout.country}`" />
                                </td>
                                <td class="noselect-nodrag">
                                    <b>{{ lastWorkout.distance | formatDistance }} {{ lastWorkout.unit }}</b>
                                    {{ $t('common.in') }}
                                    <b>{{ lastWorkout.duration | toPrettyDuration(oneFieldMode) }}</b>
                                    {{ $t('common.at') }}
                                    <b>
                                        {{ lastWorkout.speed | formatSpeed(speedFormat) }}
                                        <span v-if="speedFormat === 'pace'">min/{{ lastWorkout.unit }}</span>
                                        <span v-else>{{ lastWorkout.unit }}/h</span>
                                    </b>
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
                    </div>
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
    name: 'ShareMA',
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

            await setDoc(doc(this.$db, "workouts", id), {
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
            const q = query(workoutsCollection, orderBy("creationDate", "desc"), limit(7))
            const workoutSnapshot = await getDocs(q)

            this.lastWorkouts = workoutSnapshot.docs.map(doc => doc.data())
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
            return formatSpeed(''+value, speedFormat)
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
    @apply absolute rounded-b-lg text-primary overflow-hidden bg-white bg-opacity-80;
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

.show-workouts {
    width: auto;
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

@screen sm {
    .chevron.animated {
        @apply rotate-0 transform;
        animation: move-bottom 2000ms infinite;
    }
}

@screen md {
    .chevron.animated {
        @apply rotate-0 transform;
        animation: move-bottom 2000ms infinite;
    }
}

@screen lg {
    .chevron.animated {
        @apply rotate-90 transform;
        animation: move-right 2000ms infinite;
    }
}

@screen xl {
    .chevron.animated {
        @apply rotate-90 transform;
        animation: move-right 2000ms infinite;
    }
}
</style>
