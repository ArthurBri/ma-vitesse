<template>
    <div class="flex sm:flex-col md:flex-col justify-center items-center mx-10 sm:mx-2 md:mx-4 lg:mx-2">
        <div v-if="calculatedField && timeLimitOk">
            <span @click="shareWorkout" class="mv-btn flex py-1 text-white mr-4 sm:mb-2 md:mb-2">
                <span>{{ $t('common.share') }}</span>
                <img alt="Chevron to show more workouts" class="chevron animated self-center ml-2"
                     src="../assets/icons/chevron.svg"/>
            </span>
        </div>
        <div class="flex flex-col items-center" v-if="lastWorkouts.length">
            <div class="flex md:mb-2 sm:mb-2 lg:mb-1 xl:mb-1" v-if="!calculatedField || !timeLimitOk">
                <p>{{ $t('share_ma.last_workouts')}}</p>
                <p class="blink bg-red-700 text-white text-xs rounded-sm px-1 mx-2 self-center">
                    {{ $t('common.live') | capitalize }}</p>
            </div>
            <div class="flex items-center justify-center">
                <table class="text-white show-workouts border-gray-200 text-sm">
                    <div :class="[showAllWorkouts ? 'rounded-t-lg rounded-r-lg bg-white border text-primary' :'rounded-lg border']"
                         @click="showMoreWorkouts" class="animate flex justify-center shadow-lg cursor-pointer z-10"
                         :title="$t('share_ma.last_workouts')">
                        <tr>
                            <td class="align-middle">
                                 <span :class="'flag-icon-' + lastWorkouts[0].country_code"
                                       class="flag-icon" v-if="lastWorkouts[0].country_code"/></td>
                            <td class="noselect-nodrag align-middle text-sm">
                                <b>{{ lastWorkouts[0].distance }} {{ lastWorkouts[0].distance_unit }}</b>
                                {{ $t('common.in') }} <b>
                                {{ lastWorkouts[0].duration | prettyDuration(oneFieldMode) }}</b> {{ $t('common.at') }}
                                <b>
                                    {{ lastWorkouts[0].speed | formatSpeed(speedFormat) }}
                                    <span v-if="speedFormat === 'pace'">min/{{ lastWorkouts[0].distance_unit }}</span>
                                    <span v-else>{{ lastWorkouts[0].distance_unit }}/h</span>
                                </b>
                            </td>
                            <td class="align-middle">
                                <img :class="[showAllWorkouts ? 'primary-icon' : 'white-icon']"
                                     class="primary-icon h-4 text-center align-middle noselect-nodrag"
                                     alt="Rocket icon" src="../assets/icons/rocket.svg"
                                     v-if="lastWorkouts[0].speed > 140"/>
                                <img :class="[showAllWorkouts ? 'primary-icon' : 'white-icon']"
                                     class="primary-icon h-4 text-center align-middle noselect-nodrag"
                                     alt="Bike icon" src="../assets/icons/bike.svg"
                                     v-if="lastWorkouts[0].speed > 20 && lastWorkouts[0].speed <= 40"/>
                                <img :class="[showAllWorkouts ? 'primary-icon' : 'white-icon']"
                                     class="primary-icon h-4 text-center align-middle noselect-nodrag"
                                     alt="Car icon" src="../assets/icons/car.svg"
                                     v-if="lastWorkouts[0].speed > 40 && lastWorkouts[0].speed < 140"/>
                                <img :class="[showAllWorkouts ? 'primary-icon' : 'white-icon']"
                                     class="primary-icon h-4 text-center align-middle noselect-nodrag"
                                     alt="Run icon" src="../assets/icons/run.svg"
                                     v-if="lastWorkouts[0].speed > 7 && lastWorkouts[0].speed <= 20"/>
                                <img :class="[showAllWorkouts ? 'primary-icon' : 'white-icon']"
                                     class="primary-icon h-4 text-center align-middle"
                                     alt="Walk icon" src="../assets/icons/walk.svg"
                                     v-if="lastWorkouts[0].speed <= 7"/>
                            </td>
                            <td class="sm:hidden md:hidden text-sm align-middle noselect-nodrag">{{
                                lastWorkouts[0].created_date | moment }}
                            </td>
                        </tr>
                        <div class="flex items-center self-center justify-center h-4 opacity-100 px-2"
                             v-if="lastWorkouts.length > 1">
                            <img :class="[!showAllWorkouts ? 'transform -rotate-90' : 'primary-chevron']"
                                 alt="Chevron" class="chevron noselect-nodrag" src="../assets/icons/chevron.svg"/>
                        </div>
                    </div>
                    <div class="bg-white shadow-lg" v-if="lastWorkouts.length > 1">
                        <tbody :class="[showAllWorkouts ? 'h-48 opacity-100' : 'h-0 opacity-25']"
                               class="more-workouts show-workouts z-10">
                        <tr v-for="(lastWorkout, index) in lastWorkouts" :key="index.value">
                            <td><span :class="'flag-icon-' + lastWorkout.country_code"
                                      class="h-5 flag-icon"/></td>
                            <td class="noselect-nodrag"><b>{{lastWorkout.distance}} {{lastWorkout.distance_unit}}</b> {{
                                $t('common.in') }}
                                <b>{{lastWorkout.duration | prettyDuration(oneFieldMode)}}</b> {{ $t('common.at') }}
                                <b> {{lastWorkout.speed | formatSpeed(speedFormat) }}
                                    <span v-if="speedFormat === 'pace'">min/{{ lastWorkouts[0].distance_unit }}</span>
                                    <span v-else>{{ lastWorkouts[0].distance_unit }}/h</span>
                                </b></td>
                            <td class="align-middle">
                                <img class="primary-icon h-4 text-center align-middle noselect-nodrag"
                                     alt="Rocket icon" src="../assets/icons/rocket.svg" v-if="lastWorkout.speed > 140"/>
                                <img class="primary-icon h-4 text-center align-middle noselect-nodrag"
                                     alt="Bike icon" src="../assets/icons/bike.svg"
                                     v-if="lastWorkout.speed > 20 && lastWorkout.speed <= 40"/>
                                <img class="primary-icon w-4 text-center align-middle noselect-nodrag"
                                     alt="Car icon" src="../assets/icons/car.svg"
                                     v-if="lastWorkout.speed > 40 && lastWorkout.speed < 140"/>
                                <img class="primary-icon w-4 text-center align-middle noselect-nodrag"
                                     alt="Run icon" src="../assets/icons/run.svg"
                                     v-if="lastWorkout.speed > 7 && lastWorkout.speed <= 20"/>
                                <img class="primary-icon w-4 text-center vert align-middle noselect-nodrag"
                                     alt="Walk icon" src="../assets/icons/walk.svg" v-if="lastWorkout.speed <= 7"/>
                            </td>
                            <td class="text-center noselect-nodrag sm:hidden md:hidden">{{
                                lastWorkout.created_date | moment }}
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
    import {mapState} from 'vuex'

    let moment = require('moment');
    let {prettyDuration, formatSpeed} = require('../utils/formatData');
    // const axios = require('axios');

    export default {
        name: "ShareMA",
        mounted() {
            moment.locale(this.$i18n.locale); // 'fr'
            this.loadWorkouts();
            if (localStorage.getItem('lastSharedWorkout')) {
                this.lastSharedWorkout = localStorage.getItem('lastSharedWorkout');
            }
            this.timeLimitOk = (Date.now() - parseFloat(this.lastSharedWorkout)) / 60000 > 60;
            setInterval(() => {
                this.loadWorkouts();
                // Activation du bouton share après
                this.timeLimitOk = (Date.now() - parseFloat(this.lastSharedWorkout)) / 60000 > 60;
            }, 10000);


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
            shareWorkout() {
                // const axios = require('axios');
                // Make a request for a user with a given ID
                // const ax = axios.create({
                //     baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL
                // });

                // ax.post('/workouts', {
                //     distance: this.distance,
                //     distance_unit: this.distanceUnit,
                //     duration: this.duration,
                //     speed: this.speed,
                //     speed_unit: this.speedUnit,
                //     calculated_field: this.calculatedField,
                //     created_date: Date.now(),
                //     type: 'public'
                // }).then((response) => {
                //     console.log(response);
                //     if (response.status === 201) {
                //         localStorage.setItem('lastSharedWorkout', Date.now());
                //         this.lastSharedWorkout = Date.now();
                //     }
                // }).catch((error) => {
                //     console.log(error)
                // });
            },
            loadWorkouts() {
                // Make a request for a user with a given ID
                // const ax = axios.create({
                //     baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL
                // });
                // ax.get('/workouts?limit=7&type=public')
                //     .then(response => {
                //         this.lastWorkouts = response.data;
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     })
            },
        },
        computed: {
            ...mapState(["distance", "speed", "duration", "distanceUnit", "speedUnit", "oneFieldMode", "calculatedField", "speedFormat"]),
            calculatedField() {
                return this.distance && this.speed && this.duration
            },
            locale() {
                return this.$i18n.locale
            }
        },
        watch: {
            locale() {
                moment.locale(this.$i18n.locale);
            }
        },
        filters: {
            moment(date) {
                return moment(parseInt(date)).fromNow()
            },
            capitalize(value) {
                if (!value) return '';
                return value.toString().toUpperCase()
            },
            prettyDuration(value, oneFieldMode) {
                if (!value) return '';
                return prettyDuration(value, oneFieldMode)
            },
            formatSpeed(value, speedFormat) {

                if (!value) return '';
                return formatSpeed(value, speedFormat)
            }
        },
    }
</script>

<style lang="scss" scoped>
    td {
        @apply px-2 py-1;
    }

    .more-workouts {
        @apply absolute rounded-b-lg text-primary overflow-hidden;
        background-color: rgba(white, 0.8);
        backdrop-filter: blur(5px);
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

    .primary-chevron {
        cursor: pointer;
        filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
    }

    .chevron {
        transition: transform 200ms ease-in-out;
        cursor: pointer;
        @apply h-4;
    }

    .show-workouts {
        width: auto;
    }

    .primary-icon {
        filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
    }

    .white-icon {
        filter: invert(99%) sepia(0%) saturate(1983%) hue-rotate(172deg) brightness(114%) contrast(101%);
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