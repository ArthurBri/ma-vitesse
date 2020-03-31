<template>
    <div class="header">
        <div class="header-start flex flex-row">
            <div class="logo flex justify-start h-16">
                <img alt="logo" class="noselect-nodrag xs:w-6 sm:w-8 md:w-8 lg:w-12 xl:w-16 cursor-pointer"
                     src="../assets/logo.svg"/>
            </div>
        </div>

        <div class="header-end flex flex-row mr-8">
            <img @click="showModal('settings')" alt=""
                 class="icon settings-icon noselect-nodrag"
                 src="../assets/icons/settings.svg"
                 title="Réglages"/>
            <img @click="showModal('about')" alt=""
                 class="icon about-icon noselect-nodrag"
                 src="../assets/icons/question.svg"
                 title="A propos"/>
            <img @click="showModal('all-MA')" alt=""
                 class="icon icon-orange all-ma-icon noselect-nodrag"
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .icon {
        background: rgba(white, 0.7);
        backdrop-filter: blur(2px);

        &.icon-orange {
            background: rgba($ma-secondary, 0.9);

        }
    }

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

        .icon {
            @apply py-2 px-1 h-8 m-1 rounded shadow-lg;

            &.icon-orange {
                @apply mr-3;
            }
        }
    }

    /* 380px < width > 639px  */
    @screen sm {
        .header {
            @apply h-8 p-3 mt-2;
        }

        .icon {
            @apply py-2 px-1 h-8 m-1 rounded shadow-lg;

            &.icon-orange {
                @apply mr-3;
            }
        }
    }

    /* 640px < width > 767px */
    @screen md {
        .header {
            @apply h-8 p-4 mt-3;
        }

        .icon {
            @apply p-2 h-8 m-1 rounded shadow-lg;

            &.icon-orange {
                @apply mr-2;
            }
        }
    }

    /* 768px < width > 1023px */
    @screen lg {
        .header {
            @apply h-8 p-4 mt-3;
        }

        .icon {
            @apply p-2 h-10 m-1 rounded shadow-lg;

            &.icon-orange {
                @apply mr-2;
            }
        }
    }

    /* > 1024px */
    @screen xl {
        .header {
            @apply h-16 p-4 pl-6 pr-6 mt-2;
        }

        .icon {
            @apply p-2 h-10 m-1 rounded shadow-lg;
        }
    }

    .header {
        @apply flex flex-row items-center justify-between w-full;
    }
</style>