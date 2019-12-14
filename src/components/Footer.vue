<template>
    <div class="footer noselect-nodrag">
        <p>MA-Vitesse, une appli MA | A propos</p>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>
    .footer {
        text-align: center;
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
</style>