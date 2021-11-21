<template>
    <div class="relative w-full">
        <div class="footer">
            <div class="footer-start flex flex-row">
                <div class="logo cursor-pointer">
                    <img alt="logo" class="w-8 lg:w-12" src="../../assets/logo.svg" />
                    <h1 class="flex flex-col text-center sm:text-xl ml-1 md:text-lg lg:text-xl text-primary">
                        <span>{{ $t('global.app_name') }}</span>
                    </h1>
                </div>
            </div>
            <div class="footer-middle">
                <div class="text-center lg:px-4 rounded-lg">
                    <div
                        class="hidden xl:flex items-center font-light text-sm leading-tight rounded-full"
                        role="alert"
                        v-if="showUpdatesAlert"
                    >
                        <span class="flex rounded-full bg-secondary text-white uppercase px-2 py-1 text-xs font-light mr-2">{{
                            $t('updates_alert.new_badge')
                        }}</span>
                        <div class="flex flex-col mr-4 text-left">
                            <span class="font-semibold">{{ $t('updates_alert.message_l1') }}</span>
                            <span class="">{{ $t('updates_alert.message_l2') }}</span>
                        </div>
                        <button @click="hideUpdatesAlert" class="vi-btn-rounded">
                            <img alt="clear field button" class="h-2 clear-fields-button" src="../../assets/icons/cancel.svg" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="footer-end flex flex-row justify-end gap-2">
                <div @click="toggleModal('settings')" class="vi-btn bg-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-settings w-8 h-8 stroke-current text-vi-primary"
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
                <div @click="toggleModal('about')" class="vi-btn bg-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-info-circle w-8 h-8 stroke-current text-vi-primary"
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
        <about @close="toggleModal('about')" v-show="showAboutModal" />
        <settings @close="toggleModal('settings')" v-show="showSettingsModal" />
    </div>
</template>

<script>
import About from '@/components/About.vue'
import Settings from '@/components/Settings.vue'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'Footer',
    components: { About, Settings },
    data() {
        return {
            showAboutModal: false,
            showSettingsModal: false
        }
    },
    methods: {
        toggleModal(name) {
            switch (name) {
                case 'about':
                    this.showAboutModal = !this.showAboutModal
                    break
                case 'settings':
                    this.showSettingsModal = !this.showSettingsModal
                    break
            }
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
    @apply bg-white lg:bg-transparent lg:border-none lg:backdrop-blur-none bg-opacity-80 border-t border-gray-200 backdrop-blur-md flex items-center fixed bottom-0 justify-between w-full z-30 p-3 text-xl font-bold;
    max-height: $footer-height;
}

.logo {
    @apply flex left-8 bottom-8 justify-center items-center px-2;
}
</style>
