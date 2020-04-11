<template>
    <div class="flex justify-center items-center mx-10">
        <div v-if="calculatedField">
            <span @click="shareWorkout" class="mv-btn flex py-1 text-white mr-4">
                <span>Partager</span>
                <img class="chevron transform self-center ml-2 -rotate-90" src="../assets/icons/chevron.svg"/>
            </span>
        </div>
        <div class="flex" v-if="lastWorkouts.length">
            <div class="flex" v-if="!calculatedField">
                <p class="blink bg-red-600 text-white rounded-sm px-1 mr-2 self-center"> {{ $t('common.live') |
                    capitalize }}</p>
            </div>
            <div class="flex items-center justify-center">
                <table class="z-10 text-white show-workouts border-gray-200">
                    <div :class="[showAllWorkouts ? 'rounded-t-lg rounded-r-lg bg-white border text-primary' :'rounded-lg border']"
                         @click="showMoreWorkouts"
                         @mouseleave="showChevron = false" @mouseover="showChevron = true"
                         class="animate flex justify-center shadow-lg cursor-pointer"
                         title="Dernières courses">
                        <tr>
                            <td class="align-middle">
                                 <span :class="'flag-icon-' + lastWorkouts[0].country_code"
                                       class="h-5 flag-icon" v-if="lastWorkouts[0].country_code"/></td>
                            <td class="noselect-nodrag">
                                <b>{{ lastWorkouts[0].distance }} {{ lastWorkouts[0].distance_unit }}</b>
                                {{ $t('common.in') }} <b>
                                {{ lastWorkouts[0].duration }}</b> {{ $t('common.at') }} <b>
                                {{ lastWorkouts[0].speed }} {{ lastWorkouts[0].speed_unit }}</b>
                            </td>
                            <td>
                                <img :class="[showAllWorkouts ? 'primary-chevron' : 'white-icon']"
                                     class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/rocket.svg"
                                     v-if="lastWorkouts[0].speed > 140"/>
                                <img :class="[showAllWorkouts ? 'primary-chevron' : 'white-icon']"
                                     class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/bike.svg"
                                     v-if="lastWorkouts[0].speed > 20 && lastWorkouts[0].speed <= 40"/>
                                <img :class="[showAllWorkouts ? 'primary-chevron' : 'white-icon']"
                                     class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/car.svg"
                                     v-if="lastWorkouts[0].speed > 40 && lastWorkouts[0].speed < 140"/>
                                <img :class="[showAllWorkouts ? 'primary-chevron' : 'white-icon']"
                                     class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/run.svg"
                                     v-if="lastWorkouts[0].speed > 7 && lastWorkouts[0].speed <= 20"/>
                                <img :class="[showAllWorkouts ? 'primary-chevron' : 'white-icon']"
                                     class="primary-chevron h-4 text-center vert align-middle noselect-nodrag"
                                     src="../assets/icons/walk.svg"
                                     v-if="lastWorkouts[0].speed <= 7"/>
                            </td>
                            <td>{{ lastWorkouts[0].created_date | moment }}</td>
                        </tr>
                        <div class="flex items-center self-center justify-center h-4 opacity-100 px-2"
                             v-if="lastWorkouts.length > 1">
                            <img :class="[!showAllWorkouts ? '' : 'primary-chevron transform rotate-180']"
                                 class="chevron" src="../assets/icons/chevron.svg"/>
                        </div>
                    </div>
                    <div class="z-10 bg-white shadow-lg" v-if="lastWorkouts.length > 1">
                        <tbody :class="[showAllWorkouts ? 'h-48 opacity-100' : 'h-0 opacity-25']"
                               class="more-workouts show-workouts">
                        <tr v-for="(lastWorkout, index) in lastWorkouts" v-if="index > 0">
                            <td><span :class="'flag-icon-' + lastWorkout.country_code"
                                      class="h-5 flag-icon"/></td>
                            <td class="noselect-nodrag"><b>{{lastWorkout.distance}} {{lastWorkout.distance_unit}}</b> {{
                                $t('common.in') }}
                                <b>{{lastWorkout.duration}}</b> {{ $t('common.at') }} <b> {{lastWorkout.speed}}
                                    {{lastWorkout.speed_unit}}</b></td>
                            <td>
                                <img class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/rocket.svg" v-if="lastWorkout.speed > 140"/>
                                <img class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/bike.svg"
                                     v-if="lastWorkout.speed > 20 && lastWorkout.speed <= 40"/>
                                <img class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/car.svg"
                                     v-if="lastWorkout.speed > 40 && lastWorkout.speed < 140"/>
                                <img class="primary-chevron h-4 text-center align-middle noselect-nodrag"
                                     src="../assets/icons/run.svg"
                                     v-if="lastWorkout.speed > 7 && lastWorkout.speed <= 20"/>
                                <img class="primary-chevron h-4 text-center vert align-middle noselect-nodrag"
                                     src="../assets/icons/walk.svg" v-if="lastWorkout.speed <= 7"/>
                            </td>
                            <td class="text-center noselect-nodrag">{{ lastWorkout.created_date | moment }}</td>
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
    import {prettyDuration} from '@/utils/formatData'
    import 'flag-icon-css/css/flag-icon.css'


    let moment = require('moment');
    const axios = require('axios');

    export default {
        name: "ShareMA",
        mounted() {
            moment.locale(this.$i18n.locale); // 'fr'
            axios.get('http://ip-api.com/json')
                .then((response) => {
                    this.userCountry = response.data.countryCode;
                })
                .catch((error) => {
                    console.log(error);
                });
            this.loadWorkouts();
            setInterval(() => {
                this.loadWorkouts()
            }, 5000);
        },
        data() {
            return {
                showAllWorkouts: false,
                showChevron: false,
                lastWorkouts: [],
                userCountry: ''
            }
        },
        methods: {
            showMoreWorkouts() {
                if (this.lastWorkouts.length > 1) {
                    this.showAllWorkouts = !this.showAllWorkouts
                }
                console.log(this.lastWorkouts)
            },
            shareWorkout() {
                const axios = require('axios');
                // Make a request for a user with a given ID
                axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL;
                const ax = axios.create();
                ax.post('/publicworkouts', {
                    country_code: this.userCountry.toLowerCase(),
                    distance: parseFloat(this.distance).toFixed(2),
                    distance_unit: this.distanceUnit,
                    duration: prettyDuration(this.duration, true),
                    speed: parseFloat(this.speed).toFixed(2),
                    speed_unit: this.speedUnit,
                    created_date: Date.now()
                }, {
                    'headers': {'Content-Type': 'application/json'}
                })
                    .then((response) => {
                        if (response.status === 201) {
                            console.log('workout ajouté !')
                        } else {
                            console.log(response);
                            console.log('erreur lors de l\'ajout')
                        }
                    })
                    .catch((error) => {
                        console.error('erreur lors de l\'ajout');
                        console.log(error)
                    });
            },
            loadWorkouts() {
                const axios = require('axios');
                // Make a request for a user with a given ID
                axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL;
                const ax = axios.create();
                ax.get('/publicworkouts')
                    .then(response => {
                        this.lastWorkouts = response.data;
                        this.lastWorkouts.sort((a, b) => b.created_date - a.created_date)
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        },
        computed: {
            ...mapState(["distance", "speed", "duration", "distanceUnit", "speedUnit"]),
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
            }
        },
    }
</script>

<style lang="scss" scoped>
    td {
        @apply px-2 py-1;
    }

    .more-workouts {
        @apply absolute z-10 rounded-b-lg text-primary overflow-hidden;
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
        transition: all 300ms linear;
        cursor: pointer;
        @apply h-4;
    }

    .show-workouts {
        width: auto;
    }

    .white-icon {
        filter: invert(99%) sepia(0%) saturate(1983%) hue-rotate(172deg) brightness(114%) contrast(101%);
    }
</style>