<template>
    <div class="box p-6">
        <div class="flex h-8">
            <img alt="prediction icon" src="../assets/icons/prediction.svg" width="30px"/>
            <h2 class="noselect-nodrag self-center pl-2 font-semibold">Prédictions de course</h2>
            <span class="self-top text-xxs bg-white text-primary inline rounded-full h-3 ml-1 pl-1 pr-1">Alpha</span>
        </div>
        <table class="estimations-table" v-if="$store.state.distance !== '' && $store.state.duration !== ''">
            <tr>
                <th>Distance</th>
                <th>Temps estimé</th>
            </tr>
            <tr :key="item.label" v-for="(item) in updatedPredictions">
                <td>{{item.label}}</td>
                <td>{{item.duration}}</td>
            </tr>
        </table>
        <p class="mt-8 text-center" v-else>
            Effectuer un calcul pour voir les prédictions sur d'autres distances.
        </p>
    </div>
</template>

<script>
    export default {
        name: "Prediction.vue",
        data() {
            return {
            }
        },
        computed: {
            updatedPredictions() {
                this.$store.state.defaultDistances.forEach(element => element.duration = this.prettyDuration((this.$store.state.duration * 3600 * (element.distance.replace(',', '.') / this.$store.state.distance.replace(',', '.')) * 1.06) / 3600));
                return this.$store.state.defaultDistances.filter(i => i.distance !== this.$store.state.distance.replace(',', '.'))
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .box {
        background: $ma-primary;
        background: linear-gradient(#5b039d, #d273a5);
        color: white;
        min-height: 20vh;
        border-radius: 13px;
        box-shadow: 0 5px 10px rgba(33, 33, 33, .2);
    }

    .estimations-table {
        width: 100%;
        margin-top: 20px;
    }

    table, th, td {
        border: 1px solid white;
        border-collapse: collapse;
        padding: 5px 5px 5px 5px;
    }

    td {
        width: 50%;
    }

    .prediction {
        fill: white;
    }
</style>