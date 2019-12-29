<template>
    <div class="header noselect-nodrag">
        <img alt="" class="logo" src="../assets/logo.svg"/>
        <h1 class="title">Vitesse</h1>
    </div>
</template>

<script>
    export default {
        name: "Header.vue"
    }
</script>

<style lang="scss" scoped>
    .header {
        display: flex;
        justify-content: left;
        margin-left: 10vw;
    }

    .logo {
        height: 100%;
    }

    .title {
    }
</style>