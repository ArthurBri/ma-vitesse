<template>
    <div :class="[active ? '' : 'bg-gray-300 pb-1']"
         class="tab bg-white text-primary pt-2 pl-2 pr-2 mb-8 lg:rounded-t-lg md:rounded-t-lg shadow rounded-b-lg border-primary"
         v-show="hidden === false">
        <div class="flex h-8 mt-1 ml-1 mr-1">
            <img :src="require('../assets/icons/' + component + '.svg')" alt="Component icon" class="w-8"/>
            <h2 class="noselect-nodrag self-center pl-2 text-primary font-semibold cursor-pointer">
                {{label}}</h2>
            <span class="self-top text-xxs border border-secondary text-primary inline rounded-full h-3 ml-1 pl-1 pr-1">{{version}}</span>

        </div>
    </div>
</template>

<script>
    export default {
        name: "TabMenuItem",
        props: {
            component: String,
            label: String,
            active: Boolean,
            hidden: Boolean,
            version: String
        },
        methods: {}
    }
</script>

<style scoped>

</style>