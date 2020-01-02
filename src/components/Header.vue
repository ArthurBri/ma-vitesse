<template>
    <div class="flex justify-left items-center m-4 noselect-nodrag sbg-gray-300">
        <img alt="" class="logo w-12" src="../assets/logo.svg"/>
        <h1 class="title text-2xl">Vitesse</h1>
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
</style>