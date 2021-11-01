<template>
    <div class="relative w-full">
        <div class="footer">
            <div class="footer-start flex flex-row">
                <div class="logo cursor-pointer">
                    <img alt="logo" class=" w-8 lg:w-12 transform rotate-90" src="../../assets/logo.svg" />
                    <h1 class="flex flex-col text-center sm:text-xl sm:ml-1 md:text-lg lg:text-xl xl:text-2xl">
                        <span>{{ $t('global.app_name') }}</span>
                    </h1>
                </div>
            </div>
            <div class="footer-middle">
                <div class="text-center lg:px-4 rounded-lg">
                    <div
                        class="hidden xl:flex items-center text-indigo-100 leading-tight rounded-full"
                        role="alert"
                        v-if="showUpdatesAlert"
                    >
                        <span class="flex rounded-full bg-indigo-700 uppercase px-2 py-1 text-xs font-bold mr-2">{{
                            $t('updates_alert.new_badge')
                        }}</span>
                        <div class="flex flex-col mr-4">
                            <span class="font-semibold text-left flex-auto">{{ $t('updates_alert.message_l1') }}</span>
                            <span class="text-left flex-auto">{{ $t('updates_alert.message_l2') }}</span>
                        </div>
                        <img @click="hideUpdatesAlert" alt="Cancel icon" class="h-3 cursor-pointer" src="../../assets/icons/cancel.svg" />
                    </div>
                </div>
            </div>
            <div class="footer-end flex flex-row justify-end gap-2">
                <div @click="showModal('settings')" class="mv-btn bg-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-settings w-8 h-8 stroke-current text-mv-primary"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
                        />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <div @click="showModal('about')" class="mv-btn bg-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-info-circle w-8 h-8 stroke-current text-mv-primary"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                        <polyline points="11 12 12 12 12 16 13 16" />
                    </svg>
                </div>
            </div>
        </div>
        <about @close="closeModal('about')" v-show="showAboutModal" />
        <settings @close="closeModal('settings')" v-show="showSettingsModal" />
        <all-m-a @close="closeModal('all-MA')" v-show="showAllMaModal" />
    </div>
</template>

<script>
import About from '@/components/About.vue'
import Settings from '@/components/Settings.vue'
import AllMA from '@/components/AllMA.vue'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'Footer',
    components: { About, Settings, AllMA },
    data() {
        return {
            showAboutModal: false,
            showSettingsModal: false,
            showAllMaModal: false
        }
    },
    methods: {
        showModal(name) {
            switch (name) {
                case 'about':
                    this.showAboutModal = true
                    break
                case 'settings':
                    this.showSettingsModal = true
                    break
                case 'all-MA':
                    this.showAllMaModal = true
                    break
            }
            document.body.style.position = 'fixed'
            document.body.style.top = `-${window.scrollY}px`
        },
        closeModal(name) {
            switch (name) {
                case 'about':
                    this.showAboutModal = false
                    break
                case 'settings':
                    this.showSettingsModal = false
                    break
                case 'all-MA':
                    this.showAllMaModal = false
                    break
            }
            const scrollY = document.body.style.top
            document.body.style.position = ''
            document.body.style.top = ''
            window.scrollTo(0, parseInt(scrollY || '0') * -1)
        },
        ...mapMutations(['hideUpdatesAlert'])
    },
    computed: {
        ...mapState(['showUpdatesAlert'])
    }
}
</script>

<style lang="scss" scoped>
.footer {
    @apply bg-white bg-opacity-80 backdrop-blur-md flex items-center fixed bottom-0 justify-between w-full z-30 p-3 text-xl font-bold border-t border-gray-200;
}

.logo {
    @apply flex left-8 bottom-8 justify-center items-center px-2;
}
</style>
