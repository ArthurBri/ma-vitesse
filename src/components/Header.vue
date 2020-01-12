<template>
    <div class="header">
        <div class="header-start flex flex-row">
            <div class="logo flex">
                <img alt="logo" class="noselect-nodrag sm:w-8 md:w-8 lg:w-12 xl:w-12" src="../assets/logo.svg"/>
                <h1 class="logo-title sm:text-base lg:text-xl xl:text-2xl self-center noselect-nodrag">Vitesse</h1>
            </div>
        </div>

        <div class="header-end flex flex-row ">
            <img @click="showModalAbout" alt="" class="about-icon sm:h-4 md:h-5 lg:h-6 xl:h-6 noselect-nodrag"
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
    .logo .about-icon {
        cursor: pointer;
        transition: all 200ms;

        &:hover {
            transform: scale(1.2);
            cursor: pointer;
        }
    }

    /* <= 639px */
    @screen sm {
        .header {
            @apply h-8 m-3;
        }
    }

    /* 640px < width > 767px */
    @screen md {
        .header {
            @apply h-8 m-3;
        }
    }

    /* 768px < width > 1023px */
    @screen lg {
        .header {
            @apply h-8 m-4;
        }
    }

    /* > 1024px */
    @screen xl {
        .header {
            @apply h-12 m-4 ml-6 mr-6;
        }
    }

    .header {
        @apply flex flex-row items-center justify-between;
    }
</style>