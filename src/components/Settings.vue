<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <div>
                <h2>Réglages</h2>
            </div>
        </template>
        <template class="flex" v-slot:body>
            <div>
                <div class="flex flex-col">
                    <div class="flex flex-col ml-5">
                        <h1 class="text-xl font-bold pb-2">Composants</h1>
                        <div class="ml-2">
                            <div class="flex">
                                <label class="switch">
                                    <div>
                                        <input class="appearance-none" type="checkbox" v-model="showPredictions">
                                        <span class="slider round shadow-lg"></span>
                                    </div>
                                </label>
                                <div @click="showPredictions = !showPredictions" class="cursor-pointer ml-2">Afficher
                                    les prédictions
                                </div>
                            </div>
                            <div class="flex mt-2">
                                <label class="switch">
                                    <div>
                                        <input class="appearance-none" type="checkbox" v-model="showLapTime">
                                        <span class="slider round shadow-lg"></span>
                                    </div>
                                </label>
                                <div @click="showLapTime = !showLapTime" class="cursor-pointer ml-2">Afficher les temps
                                    de passage
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col ml-5 pt-6">
                <h1 class="text-xl font-bold">Réinitialiser</h1>
                <div class="pt-4 flex justify-center">
                    <button @click="resetApp" class="mv-btn" v-if="!appReseted">Réinitialiser l'application</button>
                    <div class="flex flex-row justify-center text-center">
                        <span v-if="appReseted">L'application a été réinitialisée, rechargez l'application pour appliquer les modifications.</span>
                    </div>
                </div>
            </div>
        </template>
        <template @click="close" v-slot:footer/>
    </drawer>
</template>

<script>
    import Drawer from '@/components/Drawer'

    export default {
        name: "Settings",
        data() {
            return {
                isModalVisible: false,
                appReseted: false
            }
        },
        components: {Drawer},
        mounted() {
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

    @screen xs {
        .btn-reset {
            @apply bg-white text-primary;
        }
    }

    @screen sm {
        .btn-reset {
            @apply bg-white text-primary;
        }
    }

    @screen md {
        .btn-reset {
            @apply bg-white text-primary;
        }
    }

    @screen lg {
        .btn-reset {
            @apply bg-white text-primary;
        }
    }

    @screen xl {
        .btn-reset {
            @apply bg-white text-primary;
        }
    }

    .switch {
        position: relative;
        display: flex;
        width: 40px;
        height: 20px;
    }


    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        top: 2px;
        left: 2px;
        @apply bg-white;
        -webkit-transition: .2s;
        transition: .2s;
        border-radius: 50%;
    }

    input:checked + .slider {
        @apply bg-primary;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 10px;
        @apply bg-gray-400;
    }
</style>