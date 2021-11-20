<template>
    <center-modal :footer="false" @close="close" margin_top="30vh" v-show="isModalVisible">
        <template v-slot:header>
            <h2>{{ $t('add_preset.title') }}</h2>
        </template>
        <template class="flex justify-center content-center" v-slot:body>
            <div class="bg-primary p-2 rounded-l-lg rounded-t-lg flex justify-between">
                <label class="pr-2 text-white" for="distanceLabel">{{ $t('add_preset.label') }}</label>
                <input
                    class="pl-4 text-right bg-transparent outline-none text-white"
                    id="distanceLabel"
                    autocomplete="off"
                    data-form-type="text"
                    :placeholder="$t('add_preset.label_eg')"
                    v-model="label"
                />
            </div>
            <div class="bg-primary p-2 mt-2 rounded-l-lg rounded-t-lg flex justify-between">
                <label class="pr-2 text-white" for="distanceValue">{{ $t('add_preset.distance') }}</label>
                <div>
                    <input
                        class="pl-4 text-right bg-transparent outline-none text-white"
                        id="distanceValue"
                        placeholder="12.5"
                        type="number"
                        v-model="distance"
                        autocomplete="off"
                        data-form-type="text"
                    />
                    <span class="pl-2 text-white">km</span>
                </div>
            </div>
            <div class="flex justify-center" v-if="newDistance && newLabel && distance && label">
                <button
                    @click="addDistance"
                    aria-label="Add distance"
                    class="btn outline-none focus:outline-none rounded-lg mt-2 pl-2 pr-2 pt-1 pb-1 border-primary border"
                    type="button"
                >
                    Ajouter
                </button>
            </div>
            <div v-else-if="matchDistanceLabel">
                <p class="text-center pt-1 mt-2">
                    Cette distance existe, sous le nom
                    <b>{{ matchDistanceLabel }}</b>
                </p>
            </div>
            <div v-else-if="matchDistanceValue">
                <p class="text-center pt-1 mt-2">
                    Ce nom existe, associé à <b>{{ matchDistanceValue }}km</b>
                </p>
            </div>
        </template>
    </center-modal>
</template>

<script>
import CenterModal from '@/components/CenterModal.vue'
import { mapState } from 'vuex'

export default {
    name: 'Settings',
    data() {
        return {
            isModalVisible: true,
            label: '',
            distance: 0,
            newDistance: true,
            newLabel: true,
            matchDistanceLabel: '',
            matchDistanceValue: ''
        }
    },
    components: { CenterModal },
    computed: {
        ...mapState(['defaultDistances'])
    },
    methods: {
        close() {
            this.$emit('close')
        },
        addDistance() {
            this.$store.commit('addPresetDistance', {
                label: this.label,
                distance: +this.distance
            })
            this.label = ''
            this.distance = 0
            this.close()
        }
    },
    watch: {
        label(newVal, oldVal) {
            this.label = newVal.length > 30 ? oldVal : newVal

            if (this.defaultDistances.find((defaultDist) => defaultDist.label === this.label)) {
                this.newDistance = false
                this.matchDistanceValue = this.defaultDistances.find((defaultDist) => defaultDist.label === this.label).distance
            } else {
                this.newDistance = true
                this.matchDistanceValue = ''
            }
        },
        distance(newVal, oldVal) {
            if (this.distance) {
                if (this.distance.match(/^0{2,}(?![.,])/g)) {
                    this.distance = oldVal
                }

                this.distance = this.distance.replace(/^0([0-9]+)/g, '$1')

                if (this.distance.match(/\d{0,9}([.,]\d{0,4})?/g)) {
                    if (this.distance.match(/\d{0,9}([.,]\d{0,4})?/g)[0] !== this.distance) {
                        this.distance = oldVal
                    }
                } else {
                    this.distance = oldVal
                    this.matchDistanceLabel = ''
                }
            }
            if (this.defaultDistances.find((defaultDist) => defaultDist.distance === this.distance)) {
                this.newLabel = false
                this.matchDistanceLabel = this.defaultDistances.find((defaultDist) => defaultDist.distance === this.distance).label
            } else {
                this.newLabel = true
                this.matchDistanceLabel = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.link {
    text-decoration: underline;
    text-decoration-color: $ma-secondary;

    &:hover {
        text-decoration-color: $ma-primary;
    }
}
</style>
