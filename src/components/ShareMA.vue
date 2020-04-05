<template>
    <div class="flex justify-center items-center mx-10">
        <div v-if="calculatedField">
            <span @click="shareWorkout" class="mv-btn py-1 text-white mr-4">Partager</span>
        </div>
        <div class="flex" v-if="lastWorkouts.length">
            <div v-if="!calculatedField">
                <p class="pr-2 blink"><img alt="Live icon" class="h-8" src="../assets/icons/live.svg"/></p>
            </div>
            <div class="flex items-center justify-center">
                <table class="z-10 text-white show-workouts border-gray-200">
                    <div :class="[showAllWorkouts ? 'rounded-t-lg bg-white text-primary' :'rounded-lg border']"
                         @click="showMoreWorkouts"
                         @mouseleave="showChevron = false" @mouseover="showChevron = true"
                         class="animate flex justify-center shadow-lg cursor-pointer"
                         title="Dernières courses">
                        <tr>
                            <td class="align-middle"><img :alt="lastWorkouts[0].country_code + ' flag icon' "
                                                          :src="require('../assets/flags/' + lastWorkouts[0].country_code + '.svg')"
                                                          class="h-5 w-5" v-if="lastWorkouts[0].country_code"/></td>
                            <td><b>{{ lastWorkouts[0].distance }} {{ lastWorkouts[0].distance_unit }}</b> en <b>{{
                                lastWorkouts[0].duration }}</b> : <b>
                                {{ lastWorkouts[0].speed }} {{ lastWorkouts[0].speed_unit }}</b></td>
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
                            <td><img :src="require('../assets/flags/' + lastWorkout.country_code + '.svg')"
                                     class="h-5"/></td>
                            <td><b>{{lastWorkout.distance}} {{lastWorkout.distance_unit}}</b> en
                                <b>{{lastWorkout.duration}}</b> à <b> {{lastWorkout.speed}}
                                    {{lastWorkout.speed_unit}}</b></td>
                            <td class="text-center">{{ lastWorkout.created_date | moment }}</td>
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

    let moment = require('moment');
    const axios = require('axios');

    export default {
        name: "ShareMA",
        mounted() {
            moment.locale('fr'); // 'fr'
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
            }
        },
        filters: {
            moment(date) {
                return moment(parseInt(date)).fromNow()
            }
        }
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
</style>