<template>
    <bottom-modal @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>Réglages</h2>
        </template>
        <template class="flex" v-slot:body>
            <div>
                <div class="flex flex-col">
                    <div>
                        <input id="showPredictions" type="checkbox" v-model="showPredictions"/>
                        <label class="pl-2 noselect-nodrag" for="showPredictions">Afficher les prédictions</label>
                    </div>
                    <!--<div class="flex flex-row">
                        Champ par défaut :
                        Distance
                    <label class="switch ml-2 mr-2 content-center">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                        Allure
                    </div>
                    <div class="flex flex-row">
                        Mode de durée par défaut :
                        3 champs
                    <label class="switch ml-2 mr-2 content-center">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                        1 champ
                    </div>-->
                </div>
            </div>
        </template>
        <template @click="close" v-slot:footer/>
    </bottom-modal>
</template>

<script>
    import BottomModal from '@/components/BottomModal'

    export default {
        name: "Settings",
        data() {
            return {
                isModalVisible: false,
                showPredictions: true
            }
        },
        components: {BottomModal},
        mounted() {
            this.showPredictions = this.getPredictionsPreference
        },
        methods: {
            close() {
                this.$emit('close');
            }
        },
        computed: {
            getPredictionsPreference: function () {
                return this.$store.state.showPredictions
            }
        },
        watch: {
            getPredictionsPreference: function () {
                this.showPredictions = this.getPredictionsPreference
            },
            showPredictions: function (newVal) {
                this.$store.commit('showPredictions', newVal)
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

    .switch {
        position: relative;
        display: inline-block;
        @apply w-6 h-4;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $ma-primary;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        @apply h-2 w-2 ml-2;
        bottom: 4px;
        right: 14px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        @apply bg-primary;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(12px);
        -ms-transform: translateX(12px);
        transform: translateX(12px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 3px;
    }

    .slider.round:before {
        border-radius: 25%;
    }
</style>