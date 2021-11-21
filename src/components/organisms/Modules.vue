<template>
    <div class="modules-wrapper" :class="modalVisible && 'is-visible'">
        <transition name="fade">
            <div class="tabs-menu" v-if="showTabMenu">
                <div class="flex justify-center my-4 lg:hidden">
                    <button @click="toggleModules" class="vi-btn bg-secondary text-white flex py-1 mr-4 gap-2">
                        {{ $t('common.close') }}
                    </button>
                </div>
                <div class="tabs">
                    <TabMenuItem
                        :isActive="activeTab === 'laptime'"
                        :isVisible="showLapTime"
                        @click.native="setActiveTab('laptime')"
                        :label="$t('laptime.title')"
                        component="laptime"
                    />
                    <TabMenuItem
                        :isActive="activeTab === 'predictions'"
                        :isVisible="showPredictions"
                        @click.native="setActiveTab('predictions')"
                        :label="$t('predictions.title')"
                        component="predictions"
                    />
                </div>
                <div class="tabs-content-wrapper">
                    <LapTime v-show="showLapTime && activeTab === 'laptime'"></LapTime>
                    <Prediction v-show="showPredictions && activeTab === 'predictions'" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import LapTime from './modules/LapTime.vue'
import Prediction from './modules/Prediction.vue'
import TabMenuItem from '@/components/TabMenuItem.vue'

export default {
    components: { LapTime, Prediction, TabMenuItem },
    name: 'Modules',
    props: {
        showModules: Boolean,
        modalVisible: Boolean
    },
    data() {
        return {
            activeTab: ''
        }
    },
    mounted() {
        this.activeTab = localStorage.getItem('activeTab') || this.showLapTime ? 'laptime' : this.showPredictions ? 'predictions' : ''
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
        showTabMenu() {
            return this.showPredictions || this.showLapTime
        }
    },
    watch: {
        showPredictions() {
            this.activeTab = this.showPredictions ? 'predictions' : 'laptime'
        },
        showLapTime() {
            this.activeTab = this.showLapTime ? 'laptime' : 'predictions'
        }
    },
    methods: {
        toggleModules() {
            this.$emit('close')
            if (this.showModules) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'auto'
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab
            localStorage.setItem('activeTab', tab)
        }
    }
}
</script>

<style lang="scss">
.modules-wrapper {
    @apply bg-primary hidden lg:block h-full z-10 lg:p-4;

    &.is-visible {
        @apply block;
    }
}

.tabs {
    @apply flex overflow-auto lg:mb-1 lg:mr-1 lg:gap-1;
}

.tabs-menu {
    @apply flex flex-col p-2;
}

.tabs-content-wrapper {
    @apply flex flex-col border-gray-200 border rounded-2xl lg:rounded-3xl bg-white p-6 mt-4 w-full justify-start overflow-auto;
    max-height: 50vh;
}
</style>
