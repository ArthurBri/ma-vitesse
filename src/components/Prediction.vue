<template>
    <div class="box ">
        <h2 class="noselect-nodrag">Prédictions de course (coeff 1.06)</h2>
        <span>Estimation de performance à partir des données du calculateur</span>
        <table class="estimations-table">
            <tr>
                <th>Distance</th>
                <th>Temps estimé</th>
            </tr>
            <tr :key="item.label" v-for="(item) in updatedPredictions">
                <td>{{item.label}}</td>
                <td>{{item.duration}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Prediction.vue",
        data() {
            return {
                predictions: [
                    {label: '10km', distance: '10'},
                    {label: 'Semi-Marathon', distance: '21.0975'},
                    {label: 'Marathon', distance: '42.195'},
                ],
            }
        },
        computed: {
            updatedPredictions() {
                // eslint-disable-next-line no-console
                this.predictions.forEach(element => element.duration = this.prettyDuration((this.$store.state.duration * 3600 * (element.distance.replace(',', '.') / this.$store.state.distance.replace(',', '.')) * 1.06) / 3600));
                return this.predictions.filter(i => i.distance !== this.$store.state.distance.replace(',', '.'))
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

<style scoped>
    .box {
        position: relative;
        background: #2C629D;
        background: linear-gradient(#5b039d, #d273a5);
        color: white;
        min-height: 20vh;
        border-radius: 13px;
        padding: 3vh 3vh 3vh 4vh;
        box-shadow: 0 5px 10px rgba(33, 33, 33, .2);
        z-index: 2;
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
</style>