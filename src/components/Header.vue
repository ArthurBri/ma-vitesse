<template>
    <div class="header">
        <div class="header-start flex flex-row">
            <div class="logo flex justify-start h-16">
                <img alt="logo" class="noselect-nodrag xs:w-6 sm:w-8 md:w-8 lg:w-12 xl:w-16 cursor-pointer"
                     src="../assets/logo.svg"/>
            </div>
        </div>

        <div class="header-end flex flex-row ">
            <img @click="showModalSettings" alt=""
                 class="settings-icon xs:h-4 sm:h-4 md:h-5 lg:h-6 xl:h-6 noselect-nodrag pr-4"
                 src="../assets/icons/settings.svg"
                 title="Réglages"/>
            <img @click="showModalAbout" alt=""
                 class="about-icon xs:h-4 sm:h-4 md:h-5 lg:h-6 xl:h-6 pr-4 noselect-nodrag"
                 src="../assets/icons/question.svg"
                 title="A propos"/>
            <img @click="showModalAllMA" alt="" class="all-ma-icon xs:h-4 sm:h-4 md:h-5 lg:h-6 xl:h-6"
                 src="../assets/icons/menu.svg" title="Toutes les applications"/>
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
            showModalAbout() {
                this.isModalAbout = true;
            },
            showModalSettings() {
                this.isModalSettings = true;
            },
            showModalAllMA() {
                this.isModalAllMA = true;
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
            },
        }
    }
</script>

<style lang="scss" scoped>
    .logo, .about-icon, .settings-icon, .all-ma-icon {
        cursor: pointer;
        transition: all 200ms;

        &:hover {
            transform: scale(1.1);
            cursor: pointer;
        }
    }

    /* <= 379px */
    @screen xs {
        .header {
            @apply h-8 p-3 mt-2;
        }
    }

    /* 380px < width > 639px  */
    @screen sm {
        .header {
            @apply h-8 p-3 mt-2;
        }
    }

    /* 640px < width > 767px */
    @screen md {
        .header {
            @apply h-8 p-4 mt-3;
        }
    }

    /* 768px < width > 1023px */
    @screen lg {
        .header {
            @apply h-8 p-4 mt-3;
        }
    }

    /* > 1024px */
    @screen xl {
        .header {
            @apply h-16 p-4 pl-6 pr-6 mt-2;
        }
    }

    .header {
        @apply flex flex-row items-center justify-between w-full;
    }
</style>