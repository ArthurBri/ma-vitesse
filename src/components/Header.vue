<template>
    <div class="header">
        <div class="header-start flex flex-row">
            <div class="logo flex justify-start h-16">
                <img alt="logo" class="noselect-nodrag xs:w-6 sm:w-8 md:w-8 lg:w-12 xl:w-12 cursor-pointer"
                     src="../assets/logo.svg"/>
                <h1 class="logo-title sm:text-base lg:text-xl xl:text-2xl self-center noselect-nodrag cursor-pointer">
                    Vitesse</h1>
            </div>
        </div>

        <div class="header-end flex flex-row ">
            <img @click="showModalAbout" alt="" class="about-icon xs:h-4 sm:h-4 md:h-5 lg:h-6 xl:h-6 noselect-nodrag"
                 src="../assets/icons/question.svg"
                 title="A propos"/>
            <!-- <img alt="" title="Toutes les applications" class="mapps-menu w-6" src="../assets/icons/menu.svg"/>-->
        </div>
        <about @close="closeModal" v-show="isModalAbout"/>
    </div>
</template>

<script>
    import About from '@/components/About'

    export default {
        name: "Header",
        components: {About},
        data() {
            return {
                isModalAbout: false
            }
        },
        methods: {
            showModalAbout() {
                this.isModalAbout = true;
            },
            closeModal() {
                this.isModalAbout = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .logo, .about-icon {
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
            @apply h-8 p-3;
        }
    }

    /* 380px < width > 639px  */
    @screen sm {
        .header {
            @apply h-8 p-3;
        }
    }

    /* 640px < width > 767px */
    @screen md {
        .header {
            @apply h-8 p-3;
        }
    }

    /* 768px < width > 1023px */
    @screen lg {
        .header {
            @apply h-8 p-4;
        }
    }

    /* > 1024px */
    @screen xl {
        .header {
            @apply h-12 p-4 pl-6 pr-6;
        }
    }

    .header {
        @apply flex flex-row items-center justify-between w-full h-16;
    }
</style>