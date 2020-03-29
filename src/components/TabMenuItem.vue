<template>
    <div :class="[active ? 'tab-active' : 'text-primary bg-white']"
         class="tab pl-2 pr-2 py-1 lg:rounded-l-lg shadow xl:rounded-l-lg xs:text-center md:rounded-t-lg"
         v-show="hidden === false">
        <div class="flex h-8 mt-1 ml-1 mr-1 pb-1 leading-none font-light">
            <img :class="[active ? '' : 'icon-inactive']" :src="require('../assets/icons/' + component + '.svg')"
                 alt="Component icon" class="w-6"/>
            <h2 class="noselect-nodrag self-center pl-2 font-semibold cursor-pointer">
                {{label}}</h2>
            <span class="self-top text-xxs border border-secondary text-primary inline rounded-full h-3 ml-1 pl-1 pr-1"
                  v-if="version">{{version}}</span>

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
        }
    }
</script>

<style lang="scss" scoped>
    .tab-active {
        background-color: rgba($ma-primary, 0.8);
        backdrop-filter: blur(2px);
        @apply text-white z-0;
    }

    .icon-inactive {
        filter: invert(28%) sepia(68%) saturate(797%) hue-rotate(176deg) brightness(100%) contrast(83%);
        @apply z-0;
    }

</style>