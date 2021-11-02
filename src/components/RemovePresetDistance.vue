<template>
    <center-modal :footer="false" @close="close" margin_top="30vh" v-show="isModalVisible">
        <template v-slot:header>
            <h2 class="noselect-nodrag">{{ $t('delete_preset.title') }}</h2>
        </template>
        <template class="flex justify-center content-center" v-slot:body>
            <div class="flex items-stretch justify-center">
                <table class="table-fixed">
                    <tr>
                        <th>{{ $t('delete_preset.label') }}</th>
                        <th>{{ $t('delete_preset.distance') }}</th>
                        <th />
                    </tr>
                    <tr :key="item.label" v-for="item in $store.state.defaultDistances">
                        <td>{{ $t(item.label) }}</td>
                        <td>{{ item.distance }}km</td>
                        <td @click="delPresetDistance(item.label)">
                            <img alt="delete a preset distance" class="icon w-3" src="../assets/icons/cancel.svg" />
                        </td>
                    </tr>
                </table>
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
            newDistance: false,
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
                distance: this.distance
            })
            this.label = ''
            this.distance = 0
            this.close()
        },
        delPresetDistance(label) {
            this.$store.commit('rmPresetDistance', label)
            if (this.defaultDistances.length < 1) {
                this.close()
            }
        }
    },
    watch: {
        label: function (newVal, oldVal) {
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
                this.newDistance = false
                this.matchDistanceLabel = this.defaultDistances.find((defaultDist) => defaultDist.distance === this.distance).label
            } else {
                this.newDistance = true
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
    transition: all 500ms;

    &:hover {
        text-decoration-color: $ma-primary;
    }
}

.icon {
    filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
}

.icon:hover {
    transform: scale(1.1);
    cursor: pointer;
}
</style>
