<template>
    <div class="footer flex flex-row justify-center select-none nodrag bg-grey">
        <span @click="isModalSuggestFeature = true"
              class="button h-6 cursor-pointer mr-4">Proposer une fonctionnalité</span>
        <span class="text-white">|</span>
        <span class="text-white ml-4 mr-2">Soutenir le projet :</span>
        <a class="noselect-nodrag h-8 outline-none" href="https://www.patreon.com/bePatron?u=27939606" tabindex="-1"
           target="_blank">
            <img alt="" class="patreon-button h-6 mr-2 rounded-full noselect-nodrag cursor-pointer"
                 src="../assets/patreon.png"/>
        </a>
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
        text-align: center;
        padding-top: 3vh;
        background-color: $ma-primary;

    }

    .nodrag {
        -webkit-user-drag: none;
        cursor: default;
    }

    .button, button {
        color: white;
        border-radius: 3px 3px 3px 3px;
        text-decoration: underline $ma-secondary;
        transition: all 0.5s;

        &:hover {
            text-decoration: underline white;
        }
    }

    .patreon-button {
        transition: all 0.1s;

        &:hover {
            transform: scale(1.05);
        }
    }

</style>