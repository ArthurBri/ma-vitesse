<template>
    <center-modal :footer='false' @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <div class="flex flex-col items-left leading-tight">
                {{ $t('workout.activity_resume') }}
                <span class="text-xs font-light text-gray-600">{{ $route.params.id }}</span>
            </div>
        </template>
        <template class="flex justify-center content-center" v-slot:body>
            <div v-if="workout">
                <div class="flex flex-col">
                    <div class="flex mb-10 xs:mb-0 xs:flex-col xs:justify-center xs:items-center sm:flex-wrap sm:justify-center">
                        <div class="xs:mb-5">
                            <p class="text-xl mx-8 xs:mx-0 xs:text-center sm:text-center xs:text-xl font-light">{{
                                $t('common.duration') }}</p>
                            <p class="text-3xl mx-8 xs:mx-0 xs:text-3xl">{{ workout.duration }}</p>
                        </div>
                        <div class="xs:mb-5">
                            <p class="text-xl mx-8 xs:mx-0 xs:text-center sm:text-center xs:text-xl font-light">{{
                                $t('common.distance') }}</p>
                            <p class="text-3xl mx-8">{{ workout.distance }} {{ workout.distance_unit}}</p>
                        </div>
                        <div class="xs:mb-5">
                            <p class="text-xl mx-8 xs:mx-0 xs:text-center sm:text-center xs:text-xl font-light">{{
                                $t('common.speed')}}</p>
                            <p class="text-3xl mx-8">{{ workout.speed }} {{ workout.speed_unit}}</p>
                        </div>
                    </div>
                    <div class="flex leading-tight justify-center items-center">
                        <span class="xs:text-sm">{{ $t('workout.added_on') }}
                            <b>{{ workout.created_date }}</b> {{ $t('workout.in') }}</span>
                        <span :class="'flag-icon-' + workout.country_code" class="ml-2 text-xl flag-icon"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center m-4 mb-8" v-else>
                <span>{{ $t('workout.no_workout_1') }}</span>
                <span>{{ $t('workout.no_workout_2') }}<b> {{ $t('workout.add_one') }}</b></span>
            </div>
            <div class="flex justify-center my-4">
                <div @click="useWorkout" class="mv-btn">
                    <div class="flex items-center" v-if="workout">
                        <img class="h-4 mr-2 px-1 primary-icon" src="../assets/icons/edit.svg"/>
                        <span>{{ $t('workout.edit_this_workout') }}</span>
                    </div>
                    <div class="flex items-center" v-else>
                        <img class="h-4 mr-2 px-1 primary-icon" src="../assets/icons/run.svg"/>
                        <span>{{ $t('workout.add_workout') }}</span>
                    </div>
                </div>
            </div>
        </template>
    </center-modal>
</template>

<script>
    import CenterModal from '@/components/CenterModal'
    import {prettyDuration} from '@/utils/formatData'
    import {mapState} from 'vuex'

    export default {
        name: "Workout",
        data() {
            return {
                isModalVisible: true,
                workout: {}
            }
        },
        components: {CenterModal},
        mounted() {
            const axios = require('axios');
            const moment = require('moment');
            // Make a request for a user with a given ID
            const ax = axios.create({
                baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL
            });
            ax.get('/publicworkouts/' + this.$route.params.id)
                .then(response => {
                    this.workout = response.data;
                    this.workout.created_date = moment(this.workout.created_date.format).format('L');
                    this.workout.duration = prettyDuration(this.workout.duration, this.oneFieldMode)
                })
                .catch((error) => {
                    console.log(error);
                    this.workout = ''
                })
        },
        methods: {
            close() {
                this.isModalVisible = false;
                this.$emit('close');
            },
            useWorkout() {
                if (this.workout) {
                    this.$store.commit('setSpeed', this.workout.speed);
                    this.$store.commit('setDistance', this.workout.distance);
                }
                // this.$store.commit('setDuration','1');
                this.close()
            }
        },
        computed: mapState(['oneFieldMode'])
    }
</script>

<style lang="scss" scoped>
    .link {
        text-decoration: underline;
        text-decoration-color: $ma-secondary;
        transition: all 500ms;

        &:hover {
            text-decoration-color: $ma-primary;
        }
    }

</style>