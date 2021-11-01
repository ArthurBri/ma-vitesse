<template>
    <div class="flex items-center h-full flex-col gap-4">
        <div class="flex items-center justify-between xs:flex-col w-full gap-2" v-if="distance && duration && defaultDistances.length">
            <div class="formula-switch">
                <div
                    v-for="formula in formulaList"
                    :key="formula.name"
                    @click="selectedFormulaName = formula.name"
                    class="switch-item"
                    :class="selectedFormulaName === formula.name && 'active'"
                >
                    <span v-if="formula.name !== 'None'">{{ formula.name }}</span>
                    <span v-else>{{ $t('common.none') }}</span>
                </div>
            </div>
            <span class="whitespace-nowrap">{{ selectedFormula.description }}</span>
        </div>
        <div class="flex items-stretch justify-center w-full" v-if="distance && duration && defaultDistances.length">
            <table class="w-full">
                <tr>
                    <th>{{ $t('calculator.distance') }}</th>
                    <th>{{ $t('predictions.estimatedDuration') }}</th>
                </tr>
                <tr :key="item.label" v-for="item in updatedPredictions">
                    <td class="text-center">{{ $t(item.label) }}</td>
                    <td class="text-center">{{ item.duration }}</td>
                </tr>
            </table>
        </div>
        <div class="flex h-full items-center">
            <p class="text-center" v-if="!distance || !duration">
                {{ $t('predictions.noCalculation') }}
            </p>
            <p class="text-center" v-if="!defaultDistances.length">
                {{ $t('predictions.noDistances') }}
            </p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { toPrettyDuration } from '../utils/formatData'

export default {
    name: 'Prediction',
    data() {
        return {
            selectedFormulaName: 'Riegel'
        }
    },
    computed: {
        ...mapState(['distance', 'duration', 'oneFieldMode']),
        updatedPredictions() {
            let predictions = JSON.parse(JSON.stringify(this.defaultDistances))
            predictions.forEach((element) => {
                const ratio = this.formulaList.find((formula) => formula.name == this.selectedFormulaName)?.ratio || 1
                element.duration = toPrettyDuration(this.duration * (element.distance / this.distance) * ratio)
            })
            return predictions.filter((i) => i.distance !== this.distance)
        },
        defaultDistances() {
            return this.$store.state.defaultDistances
        },
        formulaList() {
            return [
                {
                    name: 'Riegel',
                    description: this.$i18n.t('predictions.riegel_desc'),
                    ratio: 1.06
                },
                {
                    name: 'Williams',
                    description: this.$i18n.t('predictions.williams_desc'),
                    ratio: 1.15
                },
                {
                    name: 'None',
                    description: this.$i18n.t('predictions.none_desc'),
                    ratio: 1
                }
            ]
        },
        selectedFormula() {
            return this.formulaList.find((formula) => formula.name === this.selectedFormulaName)
        }
    }
}
</script>

<style lang="scss" scoped>

.formula-switch {
    @apply flex cursor-pointer rounded-lg;

    :first-child {
        @apply rounded-l-lg border-r-0;
    }

    :last-child {
        @apply rounded-r-lg border-l-0;
    }
}

.switch-item {
    @apply px-2 py-1 border-gray-100 border;

    &.active {
        @apply text-white bg-secondary font-bold;
    }
}
</style>
