<template>
    <div class="footer noselect-nodrag">
        <span @click="showModalAbout = true" class="about-button">A propos</span>
        <span class="suggest-button">Proposer une fonctionnalité</span>
        <about v-show="showModalAbout"/>
    </div>
</template>

<script>
    import About from '@/components/About'

    export default {
        name: "Footer",
        components: {About},
        data() {
            return {
                showModalAbout: false
            }
        }
    }
</script>

<style scoped>
    .footer {
        text-align: center;
        padding-top: 3vh;
    }

    .noselect-nodrag {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        -webkit-user-drag: none;
        cursor: default;
    }

    .about-button {
        background-color: #2C629D;
        color: white;
        border-radius: 3px 12px 3px 3px;
        padding: 0.5vh 0.5vh 0.5vh 0.5vh;
    }

    .suggest-button {
        background-color: #FF9900;
        color: white;
        margin-left: 20px;
        border-radius: 3px 12px 3px 3px;
        padding: 0.5vh 0.5vh 0.5vh 0.5vh;
    }
</style>