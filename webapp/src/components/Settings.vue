<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <div>
                <h2>{{ $t('settings.title') }}</h2>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-4 flex flex-col gap-4">
                <div class="flex flex-col items-start">
                    <h1 class="text-xl font-bold pb-2 noselect-nodrag">
                        {{ $t('settings.language_section.title') }}
                    </h1>
                    <div class="flags-list flex">
                        <div class="flex flex-col items-center noselect-nodrag pr-2" v-for="language in availableLanguages" :key="language.langCode">
                            <span
                                :class="`flag-icon-${language.countryCode}`"
                                @click="selectedLanguage = language.langCode"
                                class="flag-icon text-3xl cursor-pointer noselect-nodrag px-1 pb-3"
                            />
                            <svg
                                v-if="selectedLanguage === language.langCode"
                                xmlns="http://www.w3.org/2000/svg"
                                class="dot"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="#2c3e50"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h12v12H0z" fill="none" />
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-start">
                    <h1 class="text-xl font-bold pb-2 noselect-nodrag">
                        {{ $t('settings.unit_section.title') }}
                    </h1>
                    <div class="flex rounded-lg">
                        <div
                            :class="[unitMode === 'km' ? 'bg-primary text-white font-bold' : 'border border-primary']"
                            @click="unitMode = 'km'"
                            class="flex rounded-l-lg px-4 py-1 cursor-pointer"
                        >
                            {{ $t('common.kilometers') }}
                        </div>
                        <div
                            :class="[unitMode === 'mi' ? 'bg-primary text-white font-bold' : 'border border-primary']"
                            @click="unitMode = 'mi'"
                            class="flex rounded-r-lg px-4 py-1 cursor-pointer"
                        >
                            {{ $t('common.miles') }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-start">
                    <h1 class="text-xl font-bold pb-2 noselect-nodrag">
                        {{ $t('settings.component_section.title') }}
                    </h1>
                    <div class="flex">
                        <label class="switch">
                            <input class="appearance-none" type="checkbox" v-model="showPredictions" />
                            <span class="slider round" />
                        </label>
                        <div @click="showPredictions = !showPredictions" class="cursor-pointer ml-2 noselect-nodrag">
                            {{ $t('settings.component_section.show_predictions') }}
                        </div>
                    </div>
                    <div class="flex">
                        <label class="switch">
                            <input class="appearance-none" type="checkbox" v-model="showLapTime" />
                            <span class="slider round" />
                        </label>
                        <div @click="showLapTime = !showLapTime" class="cursor-pointer ml-2 noselect-nodrag">
                            {{ $t('settings.component_section.show_laptime') }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-start">
                    <h1 class="text-xl font-bold noselect-nodrag">
                        {{ $t('settings.reset_section.title') }}
                    </h1>
                    <div class="pt-4 flex justify-center">
                        <button @click="resetApp" class="mv-btn">
                            {{ $t('settings.reset_section.reset_button') }}
                        </button>
                    </div>
                </div>
            </div>
        </template>
        <template @click="close" v-slot:footer />
    </drawer>
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import { mapMutations } from 'vuex'

export default {
    name: 'Settings',
    data() {
        return {
            isModalVisible: false,
            selectedLanguage: 'fr',
            availableLanguages: [
                { langCode: 'fr', countryCode: 'fr' },
                { langCode: 'en', countryCode: 'gb' }
            ]
        }
    },
    components: { Drawer },
    mounted() {
        this.selectedLanguage = this.$i18n.locale
    },
    methods: {
        ...mapMutations(['resetApp']),
        close() {
            this.$emit('close')
        }
    },
    computed: {
        showPredictions: {
            get() {
                return this.$store.state.showPredictions
            },
            set(newVal) {
                this.$store.commit('showPredictions', newVal)
            }
        },
        showLapTime: {
            get() {
                return this.$store.state.showLapTime
            },
            set(newVal) {
                this.$store.commit('showLapTime', newVal)
            }
        },
        unitMode: {
            get() {
                return this.$store.state.unitMode
            },
            set(newVal) {
                this.$store.commit('changeUnitMode', newVal)
            }
        }
    },
    watch: {
        selectedLanguage() {
            this.$i18n.locale = this.selectedLanguage
            localStorage.setItem('language', this.selectedLanguage)
            document.title = `MA Vitesse | ${this.$i18n.t('global.app_meta_title')}`
        }
    }
}
</script>

<style lang="scss" scoped>
.link {
    @apply underline;
    text-decoration-color: $ma-secondary;

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
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider:before {
    @apply absolute rounded-md h-4 w-4;
    content: '';
    top: 2px;
    left: 2px;
    @apply bg-white;
    -webkit-transition: 0.2s;
    transition: 0.2s;
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
    @apply rounded-lg bg-gray-400;
}
</style>
