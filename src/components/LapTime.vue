<template>
    <div class="box">
        <div class="flex justify-between">
            <div class="laptime-start flex">
                <div :class="[laptime_type === 'distance' ? 'text-white bg-primary' : 'border border-primary']"
                     @click="laptime_type = 'distance'" class="laptime-type-switch p-2 pt-1 pb-1 rounded-l-lg">Distance
                </div>
                <div :class="[laptime_type === 'time' ? 'text-white bg-primary' : 'border border-primary']"
                     @click="laptime_type = 'time'" class="laptime-type-switch p-2 pt-1 pb-1 rounded-r-lg">Temps
                </div>
            </div>
            <div class="laptime-end flex content-center">
                <span class="self-center">Tous les : </span>
                <select class="w-16" v-if="laptime_type === 'distance'" v-model="selected_step">
                    <option :selected="step.default" :value="step.value"
                            v-for="step in distance_steps">
                        {{ step.label }}
                    </option>
                </select>
                <select class="w-16" v-if="laptime_type === 'time'" v-model="selected_step">
                    <option :selected="step.default" :value="step.value"
                            v-for="step in time_steps">
                        {{ step.label }}
                    </option>
                </select>
            </div>
        </div>

        <p>Distance : {{distance}}</p>
        <p>Durée : {{duration}}</p>
        <p>Nombre de lignes au tableau</p>
    </div>
</template>

<script>
    export default {
        name: "LapTime",
        data() {
            return {
                laptime_type: 'distance',
                selected_step: '1km',
                distance_steps: [
                    {label: '1km', value: '1', default: true},
                    {label: '2km', value: '2'},
                    {label: '3km', value: '3'}
                ],
                time_steps: [
                    {label: '1/4h', value: '0.25', default: true},
                    {label: '1/2h', value: '0.5'},
                    {label: '1h', value: '1'}
                ]
            }
        },
        computed: {
            distance: function () {
                return this.$store.state.distance
            },
            duration: function () {
                return this.$store.state.duration
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .laptime-type-switch {
        cursor: pointer;
    }
</style>