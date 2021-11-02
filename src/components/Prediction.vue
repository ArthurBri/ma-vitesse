<template>
    <div class="flex items-center h-full flex-col gap-4">
        <div class="flex items-center justify-between xs:flex-col w-full gap-2" v-if="distance && duration && defaultDistances.length">
            <CheckboxButton :options="formulaList" v-model="selectedFormulaValue" />
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
import CheckboxButton from '@/components/atoms/CheckboxButton.vue'

export default {
    components: { CheckboxButton },
    name: 'Prediction',
    data() {
        return {
            selectedFormulaValue: 'riegel'
        }
    },
    computed: {
        ...mapState(['distance', 'duration', 'oneFieldMode']),
        updatedPredictions() {
            let predictions = JSON.parse(JSON.stringify(this.defaultDistances))
            predictions.forEach((element) => {
                const ratio = this.formulaList.find((formula) => formula.label == this.selectedFormulaValue)?.ratio || 1
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
                    label: 'Riegel',
                    value: 'riegel',
                    description: this.$i18n.t('predictions.riegel_desc'),
                    ratio: 1.06
                },
                {
                    label: 'Williams',
                    value: 'williams',
                    description: this.$i18n.t('predictions.williams_desc'),
                    ratio: 1.15
                },
                {
                    label: 'None',
                    value: null,
                    description: this.$i18n.t('predictions.none_desc'),
                    ratio: 1
                }
            ]
        },
        selectedFormula() {
            return this.formulaList.find((formula) => formula.value === this.selectedFormulaValue)
        }
    }
}
</script>

<style lang="scss" scoped></style>
