<template>
    <div class="box">
        <h2 class="noselect-nodrag">Réglages</h2>
        <span>Estimation de performance à partir des données du calculateur</span>
    </div>
</template>

<script>
    export default {
        name: "Settings.vue"
    }
</script>

<style lang="scss" scoped>
    .box {
        position: relative;
        background: $ma-primary;
        background: linear-gradient(#8a8f9d, rgba(138, 143, 157, 0.12));
        color: white;
        min-height: 20vh;
        border-radius: 13px;
        padding: 3vh 3vh 3vh 4vh;
        box-shadow: 0 5px 10px rgba(33, 33, 33, .2);
        z-index: 2;
    }
</style>