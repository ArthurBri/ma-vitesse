<template>
    <div class="footer flex flex-row justify-center select-none nodrag bg-grey">
        <!--        <span class="button mr-4">Proposer une fonctionnalité</span>-->
        <!--        <span class="text-white">|</span>-->
        <span class="text-white ml-4 mr-2">Soutenir le projet :</span>
        <a class="noselect-nodrag h-8 outline-none" href="https://www.patreon.com/bePatron?u=27939606" tabindex="-1"
           target="_blank">
            <img alt="" class="patreon-button h-6 mr-2 rounded-full noselect-nodrag cursor-pointer"
                 src="../assets/patreon.png"/>
        </a>
        <about @close="closeModal" v-show="isModalAbout"/>
    </div>
</template>

<script>
    import About from '@/components/About'

    export default {
        name: "Footer",
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
    }

    .patreon-button {
        transition: all 0.1s;

        &:hover {
            transform: scale(1.05);
        }
    }

</style>