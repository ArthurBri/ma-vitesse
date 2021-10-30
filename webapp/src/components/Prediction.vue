<template>
    <div class="flex items-center justify-center h-full">
        <div class="flex items-center justify-between mb-4 xs:flex-col" v-if="distance && duration && defaultDistances.length">
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
            {{ selectedFormula.description }}
        </div>
        <div class="flex items-stretch justify-center" v-if="distance && duration && defaultDistances.length">
            <table class="w-full">
                <tr>
                    <th>{{ $t('calculator.distance') }}</th>
                    <th>{{ $t('predictions.estimated_duration') }}</th>
                </tr>
                <tr :key="item.label" v-for="item in updatedPredictions">
                    <td class="text-center">{{ item.label }}</td>
                    <td class="text-center">{{ item.duration }}</td>
                </tr>
            </table>
        </div>
        <p class="text-center" v-else-if="defaultDistances.length">
            {{ $t('predictions.label_no_calculation') }}
        </p>
        <p class="text-center" v-else>
            {{ $t('predictions.label_no_distances') }}
        </p>
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
table,
th,
td {
    @apply border-gray-500 border-collapse;
}

th {
    @apply text-primary text-center border-b-2 px-3 py-1;
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
