<template>
    <div class="flex flex-row h-16 items-center justify-between justify-left items-center ml-8 mt-4 mr-8">
        <div class="mapps-menu flex flex-row noselect-nodrag">
            <img alt="" class="w-12 noselect-nodrag" src="../assets/logo.svg"/>
            <h1 class="title text-2xl self-center">Vitesse</h1>
        </div>

        <div class="flex flex-row">
            <img @click="showModalAbout" alt="" class="mapps-menu w-5 noselect-nodrag"
                 src="../assets/icons/question.svg"
                 title="A propos"/>
            <!--            <img alt="" title="Toutes les applications" class="mapps-menu w-6" src="../assets/icons/menu.svg"/>-->
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
    .mapps-menu {
        cursor: pointer;
        transition: all 200ms;

        &:hover {
            transform: scale(1.2);
            cursor: pointer;
        }
    }
</style>