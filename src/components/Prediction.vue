<template>
    <div class="box ">
        <div class="flex justify-between">
            <!--<div class="flex h-8 mb-4">
                <img alt="prediction icon w-8" src="../assets/icons/prediction.svg" width="30px"/>
                <h2 class="noselect-nodrag self-center pl-2 text-primary font-semibold">Prédictions de course</h2>
                <span class="self-top text-xxs border border-secondary text-primary inline rounded-full h-3 ml-1 pl-1 pr-1">Alpha</span>
            </div>
            <div class="w-4 h-4">
                <img @click="close" alt="hide predictions" class="noselect-nodrag close-icon"
                     src="../assets/icons/cancel.svg"/>
            </div>-->
        </div>
        <div class="flex items-stretch justify-center"
             v-if="$store.state.distance !== '' && $store.state.duration !== '' && $store.state.defaultDistances.length > 0">
            <table>
                <tr>
                    <th class="">Distance</th>
                    <th>Temps estimé</th>
                </tr>
                <tr :key="item.label" v-for="(item) in updatedPredictions">
                    <td>{{item.label}}</td>
                    <td>{{item.duration}}</td>
                </tr>
            </table>
        </div>
        <p class="m-auto text-center text-primary" v-else-if="$store.state.defaultDistances.length > 0">
            Effectuer un calcul pour voir les prédictions sur d'autres distances.
        </p>
        <p class="m-auto text-center text-primary" v-else>
            Ajouter une distance dans le menu "Mes distances" pour voir les prédictions sur ces distances.
        </p>
    </div>
</template>

<script>
    export default {
        name: "Prediction",
        data() {
            return {}
        },
        computed: {
            updatedPredictions() {
                this.$store.state.defaultDistances.forEach(element => element.duration = this.prettyDuration((this.$store.state.duration * 3600 * (element.distance.replace(',', '.') / this.$store.state.distance.replace(',', '.')) * 1.06) / 3600));
                return this.$store.state.defaultDistances.filter(i => (i.distance !== this.$store.state.distance))
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
        @apply text-primary border-gray-500;
    }

    th {
        @apply bg-primary text-white text-left pl-3;
    }

    table tr:first-child th:first-child {
        border-top-left-radius: 8px;
    }

    table tr:first-child th:last-child {
        border-top-right-radius: 8px;
    }

    tr {
        @apply border-b;

        &:hover {
            @apply font-bold cursor-default;
        }
    }

    .close-icon:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
</style>