<template>
    <div class="footer flex flex-row flex-wrap justify-center select-none nodrag bg-grey xs:border-t xs:border-primary">
        <!--<span @click="isModalSuggestFeature = true"
              class="text-primary font-bold button h-6 cursor-pointer mr-4 xs:text-xs">Proposer une fonctionnalité</span>
        <span class="text-primary font-bold h-6 xs:hidden">|</span>-->
        <div class="flex xs:pt-1">
            <span class="text-primary ml-4 mr-2 h-6">Soutenir le projet :</span>
            <a class="noselect-nodrag h-8 outline-none xs:h-3" href="https://www.patreon.com/bePatron?u=27939606"
               tabindex="-1"
               target="_blank">
                <img alt="" class="patreon-button h-6 mr-2 rounded-full noselect-nodrag cursor-pointer"
                     src="../assets/patreon.png"/>
            </a>
        </div>
        <about @close="closeModalAbout" v-show="isModalAbout"/>
        <suggest-feature @close="closeModalSuggestFeature" v-show="isModalSuggestFeature"/>
    </div>
</template>

<script>
    import About from '@/components/About'
    import SuggestFeature from '@/components/SuggestFeature'

    export default {
        name: "Footer",
        components: {SuggestFeature, About},
        data() {
            return {
                isModalAbout: false,
                isModalSuggestFeature: false
            }
        },
        methods: {
            showModalAbout() {
                this.isModalAbout = true;
            },
            closeModalAbout() {
                this.isModalAbout = false;
            },
            closeModalSuggestFeature() {
                this.isModalSuggestFeature = false;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .footer {
        @apply text-center pt-2 h-16 w-full;
    }

    .nodrag {
        -webkit-user-drag: none;
        cursor: default;
    }

    .button, button {
        border-radius: 3px 3px 3px 3px;
        text-decoration: none;
        text-decoration-color: white;
        transition: all 0.5s;

        &:hover {
            padding-bottom: 2px;
            text-decoration: underline $ma-secondary;
        }
    }

    .patreon-button {
        transition: all 0.1s;

        &:hover {
            transform: scale(1.05);
        }
    }

</style>