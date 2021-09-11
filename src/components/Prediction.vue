<template>
    <div class="box flex-col">
        <div class="flex items-center mb-4 xs:flex-col"
             v-if="distance && duration && defaultDistances.length">
            <div class="flex cursor-pointer shadow-lg rounded-lg ">
                <div :class="[formulaSelected === 'Riegel' ? 'text-primary bg-white font-bold' : '']"
                     @click="formulaSelected = 'Riegel'" class="px-2 py-1 rounded-l-lg border-gray-100 border">
                    Riegel
                </div>
                <div :class="[formulaSelected === 'Williams' ? 'text-primary bg-white font-bold' : '']"
                     @click="formulaSelected = 'Williams'"
                     class="px-2 py-1 border-b border-t border-gray-100">
                    Williams
                </div>
                <div :class="[formulaSelected === 'None' ? 'text-primary bg-white font-bold' : '']"
                     @click="formulaSelected = 'None'" class="px-2 py-1 rounded-r-lg border-gray-100 border">
                    {{ $t('common.none')}}
                </div>
            </div>
            <p class="ml-2 text-center mt-2 xl:mt-0 xs:text-xs">{{ formulaList.filter(formula => formula.name ===
                formulaSelected)[0].description }}</p>
        </div>
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
    import {prettyDuration} from '../utils/formatData'

    export default {
        name: "Prediction",
        data() {
            return {
                formulaSelected: 'Riegel',
                formulaList: [
                    {name: 'Riegel', description: this.$i18n.t('predictions.riegel_desc')},
                    {name: 'Williams', description: this.$i18n.t('predictions.williams_desc')},
                    {name: 'None', description: this.$i18n.t('predictions.none_desc')}
                ]

            }
        },
        computed: {
            ...mapState(["distance", "duration", "oneFieldMode"]),
            updatedPredictions() {
                let predictions = JSON.parse(JSON.stringify(this.defaultDistances));
                predictions.forEach(element => {
                    if (this.formulaSelected === 'Riegel') {
                        element.duration = prettyDuration((this.duration * (element.distance / this.distance) * 1.06))
                    } else if (this.formulaSelected === 'Williams') {
                        element.duration = prettyDuration((this.duration * (element.distance / this.distance) * 1.15))
                    } else {
                        element.duration = prettyDuration((this.duration * (element.distance / this.distance)))

                    }
                });
                return predictions.filter(i => (i.distance !== this.distance))
            },
            defaultDistances() {
                return this.$store.state.defaultDistances
            },
            localeChange() {
                return this.$i18n.locale
            }
        },
        watch: {
            localeChange() {
                this.formulaList = [
                    {name: 'Riegel', description: this.$i18n.t('predictions.riegel_desc')},
                    {name: 'Williams', description: this.$i18n.t('predictions.williams_desc')},
                    {name: 'None', description: this.$i18n.t('predictions.none_desc')}
                ]
            }
        }

    }
</script>

<style lang="scss" scoped>
    .box {
        @apply mt-4 rounded-none;
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
        @apply border-gray-500 border-collapse;
    }

    th {
        @apply text-primary text-center text-white border-b-2 px-3 py-1;
        background-color: rgba(white, 0.2);
    }

    table tr:first-child th:first-child {
        @apply rounded-tl-lg;
    }

    table tr:first-child th:last-child {
        @apply rounded-tr-lg;
    }

    tr {
        @apply border-b;

        &:hover :not(th) {
            @apply cursor-default;
            background-color: rgba(#edf2f7, 0.2);
        }
    }
</style>