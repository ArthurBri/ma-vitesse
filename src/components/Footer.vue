<template>
    <div class="footer w-full flex flex-row justify-between xs:flex-wrap sm:flex-wrap justify-center select-none nodrag bg-grey xs:border-t xs:border-primary overflow-x-auto">
        <div class="footer-start w-1/8 xs:w-0 sm:w-0"></div>
        <div class="footer-center flex w-3/4 justify-center">
        <span @click="isModalSuggestFeature = true"
              class="text-white font-bold button h-6 cursor-pointer mr-4 xs:text-xs">Proposer une fonctionnalité</span>
            <span class="text-white font-bold h-6 xs:hidden">|</span>
            <div class="flex xs:pt-1">
                <span class="text-white font-bold ml-4 mr-2 h-6 xs:hidden">Soutenir le projet :</span>
                <a class="noselect-nodrag h-8 outline-none xs:h-3" href="https://www.patreon.com/bePatron?u=27939606"
                   tabindex="-1"
                   target="_blank">
                    <img alt="" class="patreon-button h-6 mr-2 rounded-full noselect-nodrag cursor-pointer"
                         src="../assets/patreon.png"/>
                </a>
            </div>
        </div>
        <div class="footer-end text-right pr-4 w-1/8 xs:w-0 sm:w-0">
            <span class="text-white h-6 sm:hidden xs:hidden">Proposé par <a class="link"
                                                                            href="https://www.linkedin.com/in/arthur-bri%C3%A8re/"
                                                                            target="_blank">Arthur Brière</a></span>
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
    .link {
        &:hover {
            padding-bottom: 2px;
            text-decoration: underline $ma-secondary;
        }
    }

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