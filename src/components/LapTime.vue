<template>
    <div class="box">
        <div class="flex w-full xs:flex-col sm:flex-col md:flex-col justify-start"
             v-if="distance <= 1000 && duration && speed">
            <div class="flex flex-col xs:flex-row xs:mb-4 sm:mb-4 md:mb-4 xs:items-center xs:justify-between sm:flex-row sm:items-center sm:justify-between md:flex-row md:items-center md:justify-between">
                <div class="laptime-start flex flex-col mr-8 xs:mr-0 sm:mr-0 shadow-lg rounded-lg noselect-nodrag cursor-pointer">
                    <div :class="[laptime_type === 'distance' ? 'text-primary bg-white font-bold' : '']"
                         @click="laptime_type = 'distance'"
                         class="px-2 py-1 text-center rounded-t-lg border-gray-100 border">
                        {{ $t('laptime.distance')}}
                    </div>
                    <div :class="[laptime_type === 'duration' ? 'text-primary bg-white font-bold' : '']"
                         @click="laptime_type = 'duration'"
                         class="px-2 py-1 text-center rounded-b-lg border-gray-100 border ">
                        {{ $t('laptime.duration')}}
                    </div>
                </div>
                <div class="laptime-end flex content-center border border-gray-200  mt-6 xs:mt-0 sm:mt-0 md:mt-0 py-1 px-1 rounded-lg mr-8 xs:mr-0 sm:mr-0 md:mr-0 shadow-lg">
                    <label aria-label="Switch between distance steps" for="distance-step"/>
                    <select class="ml-5 appearance-none noselect-nodrag bg-transparent outline-none cursor-pointer"
                            id="distance-step" v-if="laptime_type === 'distance'" v-model="selected_distance_step">
                        <option :key="step.label" :value="step.value" v-for="step in distance_steps">
                            <b>{{ step.label }}</b>
                        </option>
                    </select>
                    <label aria-label="Switch between duration steps" for="duration-steps"/>
                    <select class="ml-5 appearance-none noselect-nodrag bg-transparent outline-none cursor-pointer"
                            id="duration-steps" v-if="laptime_type === 'duration'" v-model="selected_duration_step">
                        <option :value="step.value" v-for="step in time_steps">
                            {{ step.label }}
                        </option>
                    </select>
                </div>
                <div @click="switchLaptimeSort"
                     class="shadow-lg mr-8 xs:mr-0 sm:mr-0 md:mr-0 mt-6 xs:mt-0 sm:mt-0 md:mt-0 px-2 py-1 border border-gray-200 rounded-lg flex justify-center cursor-pointer noselect-nodrag">
                    <img alt="Sort asc" class="h-6" src="../assets/icons/sort-asc.svg" v-if="laptime_sort === 'desc'">
                    <img alt="Sort desc" class="h-6" src="../assets/icons/sort-desc.svg" v-else>
                </div>
            </div>
            <div class="w-full">
                <div v-if="laptime_distance_steps.length && laptime_type === 'distance'">
                    <table class="w-full">
                        <thead>
                        <tr class="leading-tight">
                            <th>
                                <span v-if="laptime_sort === 'asc'">{{ $t('laptime.remaining_distance')}}</span>
                                <span v-else>{{ $t('laptime.traveled_distance')}}</span>
                            </th>
                            <th>{{ $t('laptime.lap_duration')}}</th>
                            <th>
                                <span v-if="laptime_sort === 'asc'">{{ $t('laptime.remaining_duration')}}</span>
                                <span v-else>{{ $t('laptime.elapsed_time')}}</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr :key="line.remaining_distance" class="border-b" v-for="line in laptime_distance_steps">
                            <td><b>{{line.remaining_distance}}</b> {{ distanceUnit }}</td>
                            <td>{{line.duration}}</td>
                            <td>{{line.remaining_duration}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="laptime_duration_steps.length && laptime_type === 'duration'">
                    <table class="w-full">
                        <thead>
                        <tr class="leading-tight">
                            <th>
                                <span v-if="laptime_sort === 'asc'">{{ $t('laptime.remaining_duration')}}</span>
                                <span v-else>{{ $t('laptime.elapsed_time')}}</span>
                            </th>
                            <th>{{ $t('laptime.lap_distance')}}</th>
                            <th>
                                <span v-if="laptime_sort === 'asc'">{{ $t('laptime.remaining_distance')}}</span>
                                <span v-else>{{ $t('laptime.traveled_distance')}}</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr :key="line.remaining_distance" class="border-b" v-for="line in laptime_duration_steps">
                            <td>{{line.remaining_duration}}</td>
                            <td><b>{{line.distance}}</b> {{ distanceUnit }}</td>
                            <td><b>{{line.remaining_distance}}</b> {{ distanceUnit }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <p class="m-auto h-full text-center" v-else-if="distance > 1000">
            {{ $t('laptime.label_max_distance_exceeded')}}
        </p>
        <p class="m-auto h-full text-center" v-else>
            {{ $t('laptime.label_no_calculation')}}
        </p>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {prettyDuration} from '@/utils/formatData'

    export default {
        name: "LapTime",
        data() {
            return {
                laptime_type: 'distance',
                laptime_sort: 'asc',
                distance_steps: [],
                time_steps: [
                    {label: '5 min', value: '0.083333333'},
                    {label: '10 min', value: '0.16666667'},
                    {label: '1/4 h', value: '0.25'},
                    {label: '1/2 h', value: '0.5'},
                    {label: '1 h', value: '1'}
                ],
                selected_distance_step: '1',
                selected_duration_step: '0.25',
                laptime_distance_steps: [],
                laptime_duration_steps: []
            }
        },
        mounted() {
            this.distance_steps = [
                {label: '1 ' + this.distanceUnit, value: '1'},
                {label: '2 ' + this.distanceUnit, value: '2'},
                {label: '3 ' + this.distanceUnit, value: '3'},
                {label: '5 ' + this.distanceUnit, value: '5'}
            ]
        },
        computed: {
            ...mapState(["distance", "duration", "speed", "oneFieldMode", "distanceUnit", "showLapTime"]),
            dataChange() {
                return [this.distance, this.duration, this.speed, this.steps_count, this.oneFieldMode, this.showLapTime].join('');
            },
            steps_count() {
                if (this.laptime_type === 'distance') {
                    return Math.ceil(this.distance / this.selected_distance_step)
                } else if (this.laptime_type === 'duration') {
                    return Math.ceil(this.duration / this.selected_duration_step)
                }
            }
        },
        watch: {
            dataChange: {
                handler() {
                    if (this.distance > 1000) return false;
                    let remaining_distance = parseFloat(this.distance.replace(",", "."));
                    let remaining_duration = parseFloat(this.duration.toString());

                    // DISTANCE - Laptime steps
                    if (this.laptime_type === 'distance') {
                        this.laptime_distance_steps = [];
                        for (let i = 0; i < this.steps_count; i++) {
                            let duration;
                            if (remaining_distance > this.selected_distance_step) {
                                duration = (this.selected_distance_step * this.duration) / this.distance;
                            } else {
                                duration = (remaining_distance * this.duration) / this.distance;
                            }
                            this.laptime_distance_steps.push({
                                remaining_distance: parseFloat(remaining_distance.toFixed(2)),
                                duration: prettyDuration(duration, this.oneFieldMode),
                                remaining_duration: prettyDuration(remaining_duration, this.oneFieldMode)
                            });
                            remaining_duration -= duration;
                            remaining_distance -= this.selected_distance_step;

                        }
                        if (this.laptime_sort === 'desc') {
                            this.laptime_distance_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                        }
                        // DURATION
                    } else if (this.laptime_type === 'duration') {
                        this.laptime_duration_steps = [];
                        for (let i = 0; i < this.steps_count; i++) {
                            let distance;
                            if (remaining_duration > this.selected_duration_step) {
                                distance = (this.selected_duration_step * this.distance) / this.duration;
                            } else {
                                distance = (remaining_duration * this.distance) / this.duration;
                            }
                            this.laptime_duration_steps.push({
                                remaining_distance: parseFloat(remaining_distance.toFixed(2)),
                                distance: parseFloat(distance.toFixed(2)),
                                remaining_duration: prettyDuration(remaining_duration, this.oneFieldMode)
                            });
                            remaining_distance -= distance;
                            remaining_duration -= this.selected_duration_step;

                        }
                        if (this.laptime_sort === 'desc') {
                            this.laptime_duration_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                        }
                    }
                }, immediate: true
            },
            laptime_sort(oldVal, newVal) {
                if (newVal === 'asc') {
                    this.laptime_distance_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                    this.laptime_duration_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                } else {
                    this.laptime_distance_steps.sort((a, b) => b.remaining_distance - a.remaining_distance);
                    this.laptime_duration_steps.sort((a, b) => b.remaining_distance - a.remaining_distance);
                }
            },
            distanceUnit() {
                this.distance_steps = [
                    {label: '1 ' + this.distanceUnit, value: '1'},
                    {label: '2 ' + this.distanceUnit, value: '2'},
                    {label: '3 ' + this.distanceUnit, value: '3'},
                    {label: '5 ' + this.distanceUnit, value: '5'}
                ];
                this.$nextTick(() => {
                    this.selected_distance_step = '1';
                })
            }
        },
        methods: {
            switchLaptimeSort() {
                this.laptime_sort = this.laptime_sort === 'asc' ? 'desc' : 'asc'
            }
        }
    }
</script>

<style lang="scss" scoped>

    .box {
        @apply flex;
    }

    table, td {
    }

    thead {
        @apply w-full;
    }

    tbody {
        @apply block overflow-y-scroll;
        max-height: 30vh;
    }

    th, td {
        @apply w-1/3 text-center;
    }

    tr {
        @apply table w-full;
    }

    th {
        @apply text-primary text-center text-white border-b-2 px-3 py-2;
        background-color: rgba(white, 0.2);
    }

    table tr {
        @apply rounded-t-lg;
    }

    table thead tr:first-child th:last-child {
        @apply rounded-tr-lg;
    }

    table thead tr:first-child th:first-child {
        @apply rounded-tl-lg;
    }

    select {
        @apply font-bold outline-none;
    }
</style>