<template>
    <div class="box">
        <div class="flex items-stretch justify-center"
             v-if="distance && duration && defaultDistances.length">
            <table>
                <tr>
                    <th>{{ $t('calculator.distance') }}</th>
                    <th>{{ $t('predictions.estimated_duration') }}</th>
                </tr>
                <tr :key="item.label" v-for="(item) in updatedPredictions">
                    <td>{{item.label}}</td>
                    <td>{{item.duration}}</td>
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
            ...mapState(["defaultDistances", "distance", "duration"]),
            updatedPredictions() {
                this.defaultDistances.forEach(element => {
                    element.duration = this.prettyDuration((this.duration * 3600 * (element.distance.replace(',', '.') / this.distance.replace(',', '.')) * 1.06) / 3600)
                });
                return this.defaultDistances.filter(i => (i.distance !== this.distance))
            }
        },
        methods: {
            prettyDuration: function (duration) {
                let hours = duration | 0;
                let minutes = ((duration % 1) * 60) | 0;
                let seconds = ((((duration % 1) * 60) % 1) * 60) | 0;

                let prettyDuration = '';
                if (hours !== 0) {
                    prettyDuration += (hours + 'h')
                }
                if (minutes !== 0) {
                    prettyDuration += (minutes + 'm')
                }
                if (seconds !== 0) {
                    prettyDuration += (seconds + 's')
                }
                return prettyDuration
            },
            close() {
                this.$emit('close');
                this.$store.commit('showPredictions', false)
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
        border-collapse: collapse;
        padding: 5px 5px 5px 5px;
        @apply border-gray-500;
    }

    th {
        @apply bg-white text-primary text-left px-3;
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