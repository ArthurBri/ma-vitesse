<template>
    <center-modal :footer='false' @close="close" margin_top="30vh" v-show="isModalVisible">
        <template v-slot:header>
            <h2 class="noselect-nodrag">{{ $t('delete_preset.title')}}</h2>
        </template>
        <template class="flex justify-center content-center" v-slot:body>
            <div class="flex items-stretch justify-center">
                <table class="table-fixed">
                    <tr>
                        <th>{{ $t('delete_preset.label')}}</th>
                        <th>{{ $t('delete_preset.distance')}}</th>
                        <th/>
                    </tr>
                    <tr :key="item.label" v-for="(item) in $store.state.defaultDistances">
                        <td>{{item.label}}</td>
                        <td>{{item.distance}}km</td>
                        <td @click="delPresetDistance(item.label)"><img alt="delete a preset distance" class="icon w-3"
                                                                        src="../assets/icons/cancel.svg"/></td>
                    </tr>
                </table>
            </div>
        </template>
    </center-modal>
</template>

<script>
    import CenterModal from '@/components/CenterModal'

    export default {
        name: "Settings",
        data() {
            return {
                isModalVisible: true,
                label: '',
                distance: '',
                newDistance: false,
                matchDistanceLabel: '',
                matchDistanceValue: ''
            }
        },
        components: {CenterModal},
        mounted() {
        },
        methods: {
            close() {
                this.$emit('close');
            },
            addDistance() {
                this.$store.commit('addPresetDistance', {label: this.label, distance: this.distance});
                this.label = '';
                this.distance = '';
                this.close();
            },
            delPresetDistance(label) {
                this.$store.commit('rmPresetDistance', label);
                if (this.$store.state.defaultDistances.length < 1) {
                    this.close();
                }
            }
        },
        watch: {
            label: function (newVal, oldVal) {
                this.label = newVal.length > 30 ? oldVal : newVal;

                if (this.$store.state.defaultDistances.find(defaultDist =>
                    defaultDist.label === this.label)) {
                    this.newDistance = false;
                    this.matchDistanceValue = this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.label === this.label).distance;
                    console.log(this.matchDistanceValue)
                } else {
                    this.newDistance = true;
                    this.matchDistanceValue = '';
                }

            },
            distance: function (newVal, oldVal) {
                if (this.distance) {
                    // check leading zero is followed by zero or , / .
                    if (this.distance.match(/^0{2,}(?![.,])/g)) {
                        // if yes : cancelling the input
                        this.distance = oldVal
                    }
                    // removing all others leading zeros by
                    this.distance = this.distance.replace(/^0([0-9]+)/g, '$1');

                    // if distance matches at least partially with the pattern ?
                    if (this.distance.match(/\d{0,9}([.,]\d{0,4})?/g)) {
                        // if not exactly match
                        if (this.distance.match(/\d{0,9}([.,]\d{0,4})?/g)[0] !== this.distance) {
                            // cancelling the input
                            this.distance = oldVal
                        }
                        // else : cancelling the input
                    } else {
                        this.distance = oldVal;
                        this.matchDistanceLabel = '';

                    }
                }
                if (this.$store.state.defaultDistances.find(defaultDist =>
                    defaultDist.distance === this.distance)) {
                    this.newDistance = false;
                    this.matchDistanceLabel = this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.distance === this.distance).label;
                    console.log(this.matchDistanceLabel)
                } else {
                    this.newDistance = true;
                    this.matchDistanceLabel = '';
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


    table, th, td {
        border-collapse: collapse;
        padding: 5px 5px 5px 5px;
        @apply text-primary border-gray-500;
    }

    th {
        @apply bg-primary text-white text-center pl-3;
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
            @apply cursor-default table-fixed;
            background-color: rgba($ma-primary, 0.2);
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