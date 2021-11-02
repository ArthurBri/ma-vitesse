<template>
    <center-modal :footer="false" @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <div class="flex flex-col items-left leading-tight">
                {{ $t('workout.activity_resume') }}
                <span class="text-xs font-light text-gray-600">{{ $route.params.id }}</span>
            </div>
        </template>
        <template class="flex justify-center content-center" v-slot:body>
            <div v-if="workout">
                <div class="flex flex-col">
                    <div class="flex flex-wrap gap-2 mb-10">
                        <div :title="workout.calculatedField === 'duration' ? $t('workout.calculatedField') : ''" class="xs:mb-5">
                            <p class="text-xl mx-8 sm:text-center font-light">
                                {{ $t('common.duration') }}
                            </p>
                            <p :class="workout.calculatedField === 'duration' && 'calculated-field'" class="text-3xl mx-8">
                                {{ workout.duration }}
                            </p>
                        </div>
                        <div :title="workout.calculatedField === 'distance' && $t('workout.calculatedField')" class="xs:mb-5">
                            <p class="text-xl mx-8 sm:text-center font-light">
                                {{ $t('common.distance') }}
                            </p>
                            <p :class="workout.calculatedField === 'distance' && 'calculated-field'" class="text-3xl mx-8">
                                {{ workout.distance }}
                                {{ workout.unit }}
                            </p>
                        </div>
                        <div :title="workout.calculatedField === 'speed' && $t('workout.calculatedField')">
                            <p class="text-xl mx-8 sm:text-center font-light">
                                {{ $t('common.speed') }}
                            </p>
                            <p :class="workout.calculatedField === 'speed' && 'calculated-field'" class="text-3xl mx-8">
                                {{ workout.speed }}
                                {{ workout.unit }}/h
                            </p>
                        </div>
                    </div>
                    <div class="flex leading-tight justify-center items-center">
                        <span
                            >{{ $t('workout.added_on') }}
                            <b>{{ workout.creationDate }}</b>
                            {{ $t('workout.in') }}</span
                        >
                        <span :class="`flag-icon-${workout.country}`" class="ml-2 text-xl flag-icon" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center m-4 mb-8" v-else>
                <span>{{ $t('workout.no_workout_1') }}</span>
                <span
                    >{{ $t('workout.no_workout_2') }}<b> {{ $t('workout.add_one') }}</b></span
                >
            </div>
            <div class="flex justify-center my-4">
                <div @click="useWorkout" class="mv-btn">
                    <div class="flex items-center" v-if="workout">
                        <img class="h-4 mr-2 px-1 primary-icon" src="../assets/icons/edit.svg" />
                        <span>{{ $t('workout.edit_this_workout') }}</span>
                    </div>
                    <div class="flex items-center" v-else>
                        <img class="h-4 mr-2 px-1 primary-icon" src="../assets/icons/run.svg" />
                        <span>{{ $t('workout.add_workout') }}</span>
                    </div>
                </div>
            </div>
        </template>
    </center-modal>
</template>

<script>
import CenterModal from '@/components/CenterModal.vue'
import { toPrettyDuration } from '@/utils/formatData'
import { mapState } from 'vuex'
import moment from 'moment'
import { doc, getDoc } from "firebase/firestore/lite"


export default {
    name: 'Workout',
    data() {
        return {
            isModalVisible: true,
            workout: {}
        }
    },
    components: { CenterModal },
    async mounted() {

        console.log(this.$route.params.id, this.$db)
        const docRef = doc(this.$db, "workouts", this.$route.params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            this.workout = docSnap.data()
            this.workout.creationDate = moment(this.workout.creationDate.format).format('L')
            this.workout.duration = toPrettyDuration(this.workout.duration, this.oneFieldMode)        
        } else {
            this.workout = ''
        }
    },
    methods: {
        close() {
            this.isModalVisible = false
            this.$emit('close')
        },
        useWorkout() {
            if (this.workout) {
                if (this.workout.calculatedField === 'speed') {
                    this.$store.commit('setDuration', this.workout.duration)
                    this.$store.commit('setDistance', this.workout.distance)
                } else if (this.workout.calculatedField === 'duration') {
                    this.$store.commit('setSpeed', this.workout.speed)
                    this.$store.commit('setDistance', this.workout.distance)
                } else if (this.workout.calculatedField === 'distance') {
                    this.$store.commit('setDuration', this.workout.duration)
                    this.$store.commit('setSpeed', this.workout.speed)
                }
            }
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

.calculated-field {
    @apply border-b-2 border-secondary;
}
</style>
