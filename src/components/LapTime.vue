<template>
    <div class="flex h-full w-full justify-center" v-if="distance <= 1000 && duration && speed">
        <div class="flex flex-col w-full justify-start">
            <div class="flex justify-between items-center mb-4">
                <CheckboxButton :options="laptimeTypeOptions" v-model="laptimeType" />
                <div class="laptime-end flex content-center border border-gray-200 mr-0 lg:mr-8 py-1 px-1 rounded-lg">
                    <label aria-label="Switch between distance steps" for="distance-step" />
                    <select
                        class="appearance-none noselect-nodrag bg-transparent outline-none cursor-pointer"
                        id="distance-step"
                        v-if="laptimeType === 'distance'"
                        v-model="selected_distance_step"
                    >
                        <option :key="step.label" :value="step.value" v-for="step in distance_steps">
                            <b>{{ step.label }}</b>
                        </option>
                    </select>
                    <label aria-label="Switch between duration steps" for="duration-steps" />
                    <select
                        class="appearance-none noselect-nodrag bg-transparent outline-none cursor-pointer"
                        id="duration-steps"
                        v-if="laptimeType === 'duration'"
                        v-model="selected_duration_step"
                    >
                        <option :value="step.value" :key="step.value" v-for="step in time_steps">
                            {{ step.label }}
                        </option>
                    </select>
                </div>
                <div
                    @click="switchLaptimeSort"
                    class="
                        lg:mr-8
                        mt-6
                        sm:mt-0
                        md:mt-0
                        px-2
                        py-1
                        border border-gray-200
                        rounded-lg
                        flex
                        justify-center
                        cursor-pointer
                        noselect-nodrag
                    "
                >
                    <img alt="Sort asc" class="h-6" src="../assets/icons/sort-asc.svg" v-if="laptimeSort === 'desc'" />
                    <img alt="Sort desc" class="h-6" src="../assets/icons/sort-desc.svg" v-else />
                </div>
            </div>
            <div class="w-full">
                <div v-if="laptime_distance_steps.length && laptimeType === 'distance'">
                    <table class="w-full">
                        <thead>
                            <tr class="leading-tight">
                                <th>
                                    <span v-if="laptimeSort === 'asc'">{{ $t('laptime.remainingDistance') }}</span>
                                    <span v-else>{{ $t('laptime.traveledDistance') }}</span>
                                </th>
                                <th>{{ $t('laptime.lap_duration') }}</th>
                                <th>
                                    <span v-if="laptimeSort === 'asc'">{{ $t('laptime.remainingDuration') }}</span>
                                    <span v-else>{{ $t('laptime.elapsedTime') }}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr :key="line.remainingDistance" class="border-b" v-for="line in laptime_distance_steps">
                                <td>
                                    <b>{{ line.remainingDistance }}</b>
                                    {{ unitMode }}
                                </td>
                                <td>{{ line.duration }}</td>
                                <td>{{ line.remainingDuration }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="laptime_duration_steps.length && laptimeType === 'duration'">
                    <table class="w-full">
                        <thead>
                            <tr class="leading-tight">
                                <th>
                                    <span v-if="laptimeSort === 'asc'">{{ $t('laptime.remainingDuration') }}</span>
                                    <span v-else>{{ $t('laptime.elapsedTime') }}</span>
                                </th>
                                <th>{{ $t('laptime.lapDistance') }}</th>
                                <th>
                                    <span v-if="laptimeSort === 'asc'">{{ $t('laptime.remainingDistance') }}</span>
                                    <span v-else>{{ $t('laptime.traveledDistance') }}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr :key="line.remainingDistance" class="border-b" v-for="line in laptime_duration_steps">
                                <td>{{ line.remainingDuration }}</td>
                                <td>
                                    <b>{{ line.distance }}</b>
                                    {{ unitMode }}
                                </td>
                                <td>
                                    <b>{{ line.remainingDistance }}</b>
                                    {{ unitMode }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
        <p v-if="distance > 1000">
            {{ $t('laptime.maxDistanceExceeded') }}
        </p>
        <p v-else>
            {{ $t('laptime.noCalculation') }}
        </p>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { toPrettyDuration } from '@/utils/formatData'
import CheckboxButton from '@/components/atoms/CheckboxButton.vue'

export default {
    name: 'LapTime',
    components: { CheckboxButton },
    data() {
        return {
            laptimeType: 'distance',
            laptimeSort: 'asc',
            distance_steps: [],
            time_steps: [
                { label: '5 min', value: '0.083333333' },
                { label: '10 min', value: '0.16666667' },
                { label: '1/4 h', value: '0.25' },
                { label: '1/2 h', value: '0.5' },
                { label: '1 h', value: '1' }
            ],
            selected_distance_step: '1',
            selected_duration_step: '0.25',
            laptime_distance_steps: [],
            laptime_duration_steps: []
        }
    },
    mounted() {
        this.distance_steps = [
            { label: '1 ' + this.unitMode, value: '1' },
            { label: '2 ' + this.unitMode, value: '2' },
            { label: '3 ' + this.unitMode, value: '3' },
            { label: '5 ' + this.unitMode, value: '5' }
        ]
    },
    computed: {
        ...mapState(['distance', 'duration', 'speed', 'oneFieldMode', 'unitMode', 'showLapTime', 'distanceUnits']),
        dataChange() {
            return [this.distance, this.duration, this.speed, this.steps_count, this.oneFieldMode, this.showLapTime].join('')
        },
        steps_count() {
            if (this.laptimeType === 'distance') {
                return Math.ceil(this.distance / this.selected_distance_step)
            } else if (this.laptimeType === 'duration') {
                return Math.ceil(this.duration / this.selected_duration_step)
            }
        },
        laptimeTypeOptions() {
            return [
                {
                    value: 'distance',
                    label: this.$t('common.distance')
                },
                {
                    value: 'duration',
                    label: this.$t('common.duration')
                }
            ]
        }
    },
    watch: {
        dataChange: {
            handler() {
                if (this.distance > 1000) return false
                let remainingDistance = this.distance
                let remainingDuration = this.duration

                // DISTANCE - Laptime steps
                if (this.laptimeType === 'distance') {
                    this.laptime_distance_steps = []

                    for (let i = 0; i < this.steps_count; i++) {
                        let duration
                        if (remainingDistance > this.selected_distance_step) {
                            duration = (this.selected_distance_step * this.duration) / this.distance
                        } else {
                            duration = (remainingDistance * this.duration) / this.distance
                        }
                        this.laptime_distance_steps.push({
                            remainingDistance: parseFloat(remainingDistance),
                            duration: toPrettyDuration(duration, this.oneFieldMode),
                            remainingDuration: toPrettyDuration(remainingDuration, this.oneFieldMode)
                        })
                        remainingDuration -= duration
                        remainingDistance -= this.selected_distance_step
                    }
                    if (this.laptimeSort === 'desc') {
                        this.laptime_distance_steps.sort((a, b) => a.remainingDistance - b.remainingDistance)
                    }
                    // DURATION
                } else if (this.laptimeType === 'duration') {
                    this.laptime_duration_steps = []
                    for (let i = 0; i < this.steps_count; i++) {
                        let distance
                        if (remainingDuration > this.selected_duration_step) {
                            distance = (this.selected_duration_step * this.distance) / this.duration
                        } else {
                            distance = (remainingDuration * this.distance) / this.duration
                        }
                        this.laptime_duration_steps.push({
                            remainingDistance: parseFloat(remainingDistance.toFixed(2)),
                            distance: parseFloat(distance.toFixed(2)),
                            remainingDuration: toPrettyDuration(remainingDuration, this.oneFieldMode)
                        })
                        remainingDistance -= distance
                        remainingDuration -= this.selected_duration_step
                    }
                    if (this.laptimeSort === 'desc') {
                        this.laptime_duration_steps.sort((a, b) => a.remainingDistance - b.remainingDistance)
                    }
                }
            },
            immediate: true
        },
        laptimeSort(newVal) {
            if (newVal === 'asc') {
                this.laptime_distance_steps.sort((a, b) => a.remainingDistance - b.remainingDistance)
                this.laptime_duration_steps.sort((a, b) => a.remainingDistance - b.remainingDistance)
            } else {
                this.laptime_distance_steps.sort((a, b) => b.remainingDistance - a.remainingDistance)
                this.laptime_duration_steps.sort((a, b) => b.remainingDistance - a.remainingDistance)
            }
        },
        unitMode() {
            this.distance_steps = [
                { label: '1 ' + this.unitMode, value: '1' },
                { label: '2 ' + this.unitMode, value: '2' },
                { label: '3 ' + this.unitMode, value: '3' },
                { label: '5 ' + this.unitMode, value: '5' }
            ]
            this.$nextTick(() => {
                this.selected_distance_step = '1'
            })
        }
    },
    methods: {
        switchLaptimeSort() {
            this.laptimeSort = this.laptimeSort === 'asc' ? 'desc' : 'asc'
        }
    }
}
</script>

<style lang="scss" scoped>
select {
    @apply font-bold outline-none;
}
</style>
