<template>
    <div class="about"></div>
</template>

<script>
    export default {
        name: "About.vue",

    }
</script>

<style scoped>
    .about {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        filter: opacity(0.5);
        filter: blur(20px);
        z-index: 9999;
    }
</style>