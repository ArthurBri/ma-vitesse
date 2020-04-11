<template>
    <div class="box">
        <div class="flex items-stretch justify-center"
             v-if="distance && duration && defaultDistances.length">
            <table class="w-full">
                <tr>
                    <th>{{ $t('calculator.distance') }}</th>
                    <th>{{ $t('predictions.estimated_duration') }}</th>
                </tr>
                <tr :key="item.label" v-for="(item) in updatedPredictions">
                    <td class="text-center">{{item.label}}</td>
                    <td class="text-center">{{item.duration}}</td>
                </tr>
            </table>
        </div>
        <p class="m-auto text-center" v-else-if="defaultDistances.length">
            {{ $t('predictions.label_no_calculation')}}
        </p>
        <p class="m-auto text-center" v-else>
            {{ $t('predictions.label_no_distances')}}
        </p>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "Prediction",
        data() {
            return {}
        },
        computed: {
            ...mapState(["defaultDistances", "distance", "duration", "oneFieldMode"]),
            updatedPredictions() {
                this.defaultDistances.forEach(element => {
                    element.duration = this.prettyDuration((this.duration * 3600 * (element.distance.replace(',', '.') / this.distance.replace(',', '.')) * 1.06) / 3600)
                });
                return this.defaultDistances.filter(i => (i.distance !== this.distance))
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
                    prettyDuration += hours && hours < 10 ? '0' + hours + 'h' : hours ? hours + 'h' : '';
                    prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + 'm' : minutes ? minutes + 'm' : '';
                    prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds + 's' : seconds ? seconds + 's' : '';
                } else {
                    prettyDuration += hours && hours < 10 ? '0' + hours + ':' : hours ? hours + ':' : '00:';
                    prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + ':' : minutes < 10 ? '0' + minutes + ':' : minutes ? minutes + ':' : '00:';
                    prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds : seconds ? seconds : '00';
                }

                return prettyDuration
            }
        }
    }
</script>

<style lang="scss" scoped>
    @screen xs {
        .box {
            @apply mt-4 rounded-none;
        }
    }

    @screen sm {
        .box {
            @apply rounded-lg;
        }
    }

    @screen md {
        .box {
            @apply rounded-b-lg rounded-r-lg;
        }
    }

    @screen lg {
        .box {
            @apply rounded-b-lg rounded-r-lg;
        }
    }

    @screen xl {
        .box {
            @apply rounded-b-lg rounded-r-lg;

        }
    }


    table, th, td {
        @apply border-gray-500 border-collapse p-1;
    }

    th {
        @apply bg-white text-primary text-center px-3;
    }

    table tr:first-child th:first-child {
        @apply rounded-tl-lg;
    }

    table tr:first-child th:last-child {
        @apply rounded-tr-lg;
    }

    tr {
        @apply border-b;

        &:hover {
            @apply cursor-default;
            background-color: rgba(#edf2f7, 0.2);
        }
    }

    .close-icon:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
</style>