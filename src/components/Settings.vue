<template>
    <bottom-modal @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <div>
                <h2>Réglages</h2>
                <span class="text-sm font-normal">Les réglages sont stockés uniquement dans votre navigateur. Toute suppression du cache entraînera la perte de ceux-ci.</span>
            </div>
            <button @click="resetApp" class="btn-reset" v-if="!appReseted">Réinitialiser</button>
        </template>
        <template class="flex" v-slot:body>
            <div>
                <div class="flex flex-col">
                    <div class="flex flex-col">
                        <div>
                            <input id="showPredictions" type="checkbox" v-model="showPredictions"/>
                            <label class="pl-2 noselect-nodrag" for="showPredictions">Afficher les prédictions</label>
                        </div>
                        <!--<div>
                            <input id="showLapTime" type="checkbox" v-model="showLapTime"/>
                            <label class="pl-2 noselect-nodrag" for="showLapTime">Afficher les temps de passage</label>
                        </div>-->
                    </div>
                    <div class="flex flex-row justify-center">
                        <span v-if="appReseted">L'application a été réinitialisée, rechargez la page pour appliquer les modifications.</span>
                    </div>
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
                appReseted: false
            }
        },
        components: {BottomModal},
        mounted() {
            this.showPredictions = this.getPredictionsPreference
        },
        methods: {
            close() {
                this.$emit('close');
            },
            resetApp() {
                localStorage.clear();
                this.appReseted = true
            }
        },
        computed: {
            showPredictions: {
                get: function () {
                    return this.$store.state.showPredictions
                }, set: function (newVal) {
                    this.$store.commit('showPredictions', newVal)
                }
            },
            showLapTime: {
                get: function () {
                    return this.$store.state.showLapTime
                }, set: function (newVal) {
                    this.$store.commit('showLapTime', newVal)
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

    .btn-reset {
        transition: all 500ms;
        @apply pt-1 pb-1 pl-2 pr-2 rounded-lg bg-white text-primary text-sm font-light;

        &:hover {
            @apply bg-secondary;
        }
    }
</style>