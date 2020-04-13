<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <div>
                <h2>{{ $t('settings.title')}}</h2>
            </div>
        </template>
        <template class="flex" v-slot:body>
            <div class="flex ml-5">
                <div>
                    <h1 class="text-xl font-bold pb-2 noselect-nodrag">{{ $t('settings.language_section.title') }}</h1>
                    <div class="ml-2 flex mb-2">
                        <div class="flex">
                            <div class="flex flex-col noselect-nodrag mx-2" v-for="language in langList">
                                <span :class="'flag-icon-' + language.country_code"
                                      @click="lang = language.lang_code"
                                      class="flag-icon text-3xl cursor-pointer noselect-nodrag px-1 pb-3 mb-2"/>
                                <svg class="ml-2 w-4 h-4 self-center" style="fill:#2C629D"
                                     v-if="lang === language.lang_code">
                                    <rect height="6" rx="3" ry="3" width="6" x="0" y="0"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex ml-5 mb-4">
                <div>
                    <h1 class="text-xl font-bold pb-2 noselect-nodrag">{{ $t('settings.unit_section.title') }}</h1>
                    <div class="ml-2 flex mb-2">
                        <div class="flex shadow-lg rounded-lg">
                            <div :class="[unitMode === 'kilometers' ? 'bg-primary text-white font-bold' : 'bg-gray-300']"
                                 @click="unitMode = 'kilometers'" class="flex rounded-l-lg px-4 py-1 cursor-pointer">
                                {{ $t('common.kilometers')}}
                            </div>
                            <div :class="[unitMode === 'miles' ? 'bg-primary text-white font-bold' : 'bg-gray-300']"
                                 @click="unitMode = 'miles'" class="flex rounded-r-lg px-4 py-1 cursor-pointer">
                                {{ $t('common.miles')}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col ml-5">
                <h1 class="text-xl font-bold pb-2 noselect-nodrag">{{ $t('settings.component_section.title') }}</h1>
                <div class="ml-2">
                    <div class="flex">
                        <label class="switch">
                            <input class="appearance-none" type="checkbox" v-model="showPredictions">
                            <span class="slider round shadow-lg"/>
                        </label>
                        <div @click="showPredictions = !showPredictions"
                             class="cursor-pointer ml-2 noselect-nodrag">
                            {{ $t('settings.component_section.show_predictions') }}
                        </div>
                    </div>
                    <div class="mt-2">
                        <div class="flex">
                            <label class="switch">
                                <<input class="appearance-none" type="checkbox" v-model="showLapTime">
                                <span class="slider round shadow-lg"/>
                            </label>
                            <div @click="showLapTime = !showLapTime" class="cursor-pointer ml-2 noselect-nodrag">
                                {{ $t('settings.component_section.show_laptime') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col ml-5 pt-6">
                <h1 class="text-xl font-bold noselect-nodrag">{{ $t('settings.reset_section.title') }}</h1>
                <div class="pt-4 flex justify-center">
                    <button @click="resetApp" class="mv-btn" v-if="!appReseted">
                        {{$t('settings.reset_section.reset_button')}}
                    </button>
                    <div class="flex flex-row justify-center text-center">
                        <span v-if="appReseted">{{ $t('settings.reset_section.reset_message_success') }}</span>
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
                appReseted: false,
                lang: 'fr',
                langList: [
                    {lang_code: 'fr', country_code: 'fr'},
                    {lang_code: 'en', country_code: 'gb'}
                ]
            }
        },
        components: {Drawer},
        mounted() {
            this.lang = this.$i18n.locale
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
            },
            unitMode: {
                get() {
                    return this.$store.state.unitMode
                }, set(newVal) {
                    this.$store.commit('changeUnitMode', newVal)
                }
            }

        },
        watch: {
            lang() {
                this.$i18n.locale = this.lang;
                localStorage.setItem('lang', this.lang);
                document.title = 'MA Vitesse | ' + this.$i18n.t('global.app_meta_title');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .body {
        @apply bg-red-600;
    }

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