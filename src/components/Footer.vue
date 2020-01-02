<template>
    <div class="footer select-none nodrag bg-grey">
        <span @click="showModalAbout" class="button">A propos</span>
        <span class="text-white">|</span>
        <span class="button">Proposer une fonctionnalité</span>
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

    .button {
        color: white;
        border-radius: 3px 3px 3px 3px;
        text-decoration: underline $ma-secondary;
        padding: 0.5vh 0.5vh 0.5vh 0.5vh;
        transition: all 0.5s;

        &:hover {
            text-decoration: underline white;
        }
    }

</style>