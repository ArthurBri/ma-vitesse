<template>
    <center-modal :footer='false' @close="close" v-show="isModalVisible">
        <template v-slot:header>Activité</template>
        <template class="flex justify-center content-center" v-slot:body>
            <div class="flex flex-col">
                <div class="flex leading-tight justify-center items-center mb-5">
                    <span>Ajoutée le <b>16/06/2020</b> en</span>
                    <span class="ml-2 text-xl flag-icon flag-icon-fr"/>
                </div>
                <div class="flex">
                    <div>
                        <p class="text-xl mx-8 font-light">Durée</p>
                        <p class="text-3xl mx-8">00:10:10</p>
                    </div>
                    <div>
                        <p class="text-xl mx-8 font-light">Distance</p>
                        <p class="text-3xl mx-8">10,5km</p>
                    </div>
                    <div>
                        <p class="text-xl mx-8 font-light">Vitesse</p>
                        <p class="text-3xl mx-8">10,5kmh</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-center my-4">
                <span class="mv-btn">Utiliser ce workout</span>
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
                newDistance: true,
                newLabel: true,
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
                if (this.distance !== '') {
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
                    this.newLabel = false;
                    this.matchDistanceLabel = this.$store.state.defaultDistances.find(defaultDist =>
                        defaultDist.distance === this.distance).label;
                } else {
                    this.newLabel = true;
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

</style>