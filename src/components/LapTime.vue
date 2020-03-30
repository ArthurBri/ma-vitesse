<template>
    <div class="box">
        <div class="flex xs:flex-col sm:flex-col md:flex-col justify-start" v-if="distance && duration && speed">
            <div class="flex flex-col xs:flex-row xs:mb-4 sm:mb-4 md:mb-4 xs:items-center xs:justify-between sm:flex-row sm:items-center sm:justify-between md:flex-row md:items-center md:justify-between">
                <div class="laptime-start flex flex-col mr-8 xs:mr-0 sm:mr-0 shadow-lg noselect-nodrag">
                    <div :class="[laptime_type === 'distance' ? 'text-primary bg-white font-bold' : '']"
                         @click="laptime_type = 'distance'" class="laptime-type-switch rounded-t-lg">{{
                        $t('laptime.distance')}}
                    </div>
                    <div :class="[laptime_type === 'duration' ? 'text-primary bg-white font-bold' : '']"
                         @click="laptime_type = 'duration'" class="laptime-type-switch rounded-b-lg ">{{
                        $t('laptime.duration')}}
                    </div>
                </div>
                <div class="laptime-end flex content-center bg-white text-primary mt-6 xs:mt-0 sm:mt-0 md:mt-0 py-1 px-1 rounded-lg mr-8 xs:mr-0 sm:mr-0 md:mr-0 shadow-lg">
                    <select class="ml-5 appearance-none noselect-nodrag bg-transparent outline-none cursor-pointer"
                            v-if="laptime_type === 'distance'" v-model="selected_distance_step">
                        <option :value="step.value" v-for="step in distance_steps">
                            <b>{{ step.label }}</b>
                        </option>
                    </select>
                    <select class="ml-5 appearance-none noselect-nodrag bg-transparent outline-none cursor-pointer"
                            v-if="laptime_type === 'duration'" v-model="selected_duration_step">
                        <option :value="step.value" v-for="step in time_steps">
                            {{ step.label }}
                        </option>
                    </select>
                </div>
                <div @click="switchLaptimeSort"
                     class="shadow-lg mr-8 xs:mr-0 sm:mr-0 md:mr-0 mt-6 xs:mt-0 sm:mt-0 md:mt-0 px-2 py-1 bg-white rounded-lg flex justify-center cursor-pointer noselect-nodrag">
                    <img class="h-6" src="../assets/icons/sort-asc.svg" v-if="laptime_sort === 'desc'">
                    <img class="h-6" src="../assets/icons/sort-desc.svg" v-else>
                </div>
            </div>
            <div>
                <div v-if="laptime_distance_steps.length && laptime_type === 'distance'">
                    <table class="w-full">
                        <thead>
                        <tr class="text-primary bg-white">
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
                            <td>{{line.remaining_distance}}km</td>
                            <td>{{line.duration}}</td>
                            <td>{{line.remaining_duration}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="laptime_duration_steps.length && laptime_type === 'duration'">
                    <table class="w-full">
                        <thead>
                        <tr class="text-primary bg-white">
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
                            <td><b>{{line.distance}}</b> km</td>
                            <td><b>{{line.remaining_distance}}</b> km</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <p class="m-auto h-full text-center" v-else>
            {{ $t('laptime.label_no_calculation')}}
        </p>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "LapTime",
        data() {
            return {
                laptime_type: 'distance',
                laptime_sort: 'asc',
                distance_steps: [
                    {label: '1km', value: '1'},
                    {label: '2km', value: '2'},
                    {label: '3km', value: '3'},
                    {label: '5km', value: '5'},
                ],
                time_steps: [
                    {label: '5min', value: '0.083333333'},
                    {label: '10min', value: '0.16666667'},
                    {label: '1/4h', value: '0.25'},
                    {label: '1/2h', value: '0.5'},
                    {label: '1h', value: '1'}
                ],
                selected_distance_step: '1',
                selected_duration_step: '0.25',
                laptime_distance_steps: [],
                laptime_duration_steps: []
            }
        },
        computed: {
            ...mapState(["distance", "duration", "speed", "oneFieldMode"]),
            dataChange() {
                return [this.distance, this.duration, this.speed, this.steps_count, this.oneFieldMode].join('');
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
            dataChange() {
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
                            remaining_distance: parseFloat(remaining_distance.toFixed(1)),
                            duration: this.prettyDuration(duration),
                            remaining_duration: this.prettyDuration(remaining_duration)
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
                            remaining_distance: parseFloat(remaining_distance.toFixed(1)),
                            distance: parseFloat(distance.toFixed(1)),
                            remaining_duration: this.prettyDuration(remaining_duration)
                        });
                        remaining_distance -= distance;
                        remaining_duration -= this.selected_duration_step;

                    }
                    if (this.laptime_sort === 'desc') {
                        this.laptime_duration_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                    }
                }
            },
            laptime_sort(oldVal, newVal) {
                if (newVal === 'asc') {
                    this.laptime_distance_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                    this.laptime_duration_steps.sort((a, b) => a.remaining_distance - b.remaining_distance);
                } else {
                    this.laptime_distance_steps.sort((a, b) => b.remaining_distance - a.remaining_distance);
                    this.laptime_duration_steps.sort((a, b) => b.remaining_distance - a.remaining_distance);
                }
            }
        },
        methods: {
            prettyDuration(duration) {
                let prettyDuration = '';
                let hours = duration | 0;
                let minutes = ((duration % 1) * 60) | 0 >= 1 ? parseInt((duration % 1) * 60) : 0;
                let seconds = (((duration % 1) * 60) % 1) * 60;

                seconds = !hours && !minutes && seconds >= 1 ? parseFloat((seconds).toFixed(1)) : hours || minutes && seconds >= 1 ? Math.round(seconds) : seconds >= 1 ? seconds.toFixed(1) : 0;
                if (seconds === 60) {
                    minutes++, seconds = 0
                }
                if (minutes === 60) {
                    hours++, minutes = 0
                }

                if (this.oneFieldMode) {
                    prettyDuration += hours ? hours + 'h' : '';
                    prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + 'm' : minutes ? minutes + 'm' : '';
                    prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds + 's' : seconds ? seconds + 's' : '';
                } else {
                    prettyDuration += hours ? hours + ':' : '00:';
                    prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + ':' : minutes < 10 ? '0' + minutes + ':' : minutes ? minutes + ':' : '00:';
                    prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds : seconds ? seconds : '00';
                }

                return prettyDuration
            },
            switchLaptimeSort() {
                this.laptime_sort = this.laptime_sort === 'asc' ? 'desc' : 'asc'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .laptime-type-switch {
        @apply text-center p-2 pt-1 pb-1 shadow-lg cursor-pointer;
    }

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

    table tr {
        @apply rounded-t-lg;
    }

    table thead tr:first-child th:last-child {
        @apply rounded-tr-lg;
    }


    select {
        @apply font-bold outline-none;
    }
</style>