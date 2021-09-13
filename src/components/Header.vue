<template>
    <div class="relative w-full">
        <div class="header">
            <div class="header-start flex flex-row">
                <div class="logo">
                    <img alt="logo" class="noselect-nodrag xs:w-6 sm:w-8 md:w-8 lg:w-12 xl:w-12 cursor-pointer"
                         src="../assets/logo.svg"/>
                    <h1 class="flex flex-col text-center xs:text-base xs:ml-1 xs:font-bold sm:text-xl sm:ml-1 md:text-lg lg:text-xl xl:text-2xl">
                        <span>{{ $t('global.app_name') }}</span>
                    </h1>
                </div>
            </div>
            <div class="header-middle">
                <div class="text-center lg:px-4 rounded-lg">
                    <div class="hidden xl:flex items-center text-indigo-100 leading-tight rounded-full" role="alert"
                         v-if="showUpdatesAlert">
                        <span class="flex rounded-full bg-indigo-700 uppercase px-2 py-1 text-xs font-bold mr-2">{{ $t('updates_alert.new_badge')}}</span>
                        <div class="flex flex-col mr-4">
                            <span class="font-semibold text-left flex-auto">{{ $t('updates_alert.message_l1')}}</span>
                            <span class="text-left flex-auto">{{ $t('updates_alert.message_l2')}}</span>
                        </div>
                        <img @click="hideUpdatesAlert" alt="Cancel icon" class="h-3 cursor-pointer"
                             src="../assets/icons/cancel.svg"/>
                    </div>
                </div>
            </div>
            <div class="header-end flex flex-row justify-end gap-2">
                <img @click="showModal('settings')" alt=""
                     class="mv-btn bg-primary h-10 p-2"
                     src="../assets/icons/settings.svg"
                     title="Réglages"/>
                <img @click="showModal('about')" alt=""
                     class="mv-btn bg-primary h-10 p-2"
                     src="../assets/icons/question.svg"
                     title="A propos"/>
                <img @click="showModal('all-MA')" alt=""
                     class="mv-btn bg-secondary h-10 w-10 p-2"
                     src="../assets/icons/menu.svg" title="Toutes les applications"/>
            </div>
        </div>
        <about @close="closeModal('about')" v-show="isModalAbout"/>
        <settings @close="closeModal('settings')" v-show="isModalSettings"/>
        <all-m-a @close="closeModal('all-MA')" v-show="isModalAllMA"/>
    </div>
</template>

<script>
    import About from '@/components/About'
    import Settings from '@/components/Settings'
    import AllMA from '@/components/AllMA'
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "Header",
        components: {About, Settings, AllMA},
        data() {
            return {
                isModalAbout: false,
                isModalSettings: false,
                isModalAllMA: false
            }
        },
        methods: {
            showModal(name) {
                switch (name) {
                    case 'about':
                        this.isModalAbout = true;
                        break;
                    case 'settings':
                        this.isModalSettings = true;
                        break;
                    case 'all-MA':
                        this.isModalAllMA = true;
                        break;
                }
                document.body.style.position = 'fixed';
                document.body.style.top = `-${window.scrollY}px`;
            },
            closeModal(name) {
                switch (name) {
                    case 'about':
                        this.isModalAbout = false;
                        break;
                    case 'settings':
                        this.isModalSettings = false;
                        break;
                    case 'all-MA':
                        this.isModalAllMA = false;
                        break;
                }
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            },
            ...mapMutations(['hideUpdatesAlert'])
        },
        computed: {
            ...mapState(['showUpdatesAlert'])
        }
    }
</script>

<style lang="scss" scoped>
    .icon {
        &.icon-orange {
            background: rgba($ma-secondary, 0.9);

        }
    }

    .logo, .about-icon, .settings-icon, .all-ma-icon {
        cursor: pointer;

        &:hover {
            transform: scale(1.05);
            cursor: pointer;
        }
    }

    .header {
        @apply flex flex-row items-center justify-between w-full z-30 p-3 text-white;
        backdrop-filter: blur(2px);
    }

    .logo {
        @apply flex fixed left-8 bottom-8 justify-center items-center px-2;
    }
</style>
