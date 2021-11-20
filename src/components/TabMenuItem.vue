<template>
    <div class="tab" :class="isActive && 'active'" v-show="isVisible">
        <div class="flex h-8 mt-1 ml-1 mr-1 pb-1 leading-none font-light">
            <img :class="!isActive && 'icon-inactive'" :src="icon" alt="Component icon" class="w-6" />
            <h2 class="self-center pl-2 font-semibold cursor-pointer">
                {{ label }}
            </h2>
        </div>
    </div>
</template>

<script>
const allIcons = import.meta.glob('../assets/icons/*.svg')

export default {
    name: 'TabMenuItem',
    props: {
        component: String,
        label: String,
        isActive: Boolean,
        isVisible: Boolean
    },
    data() {
        return {
            icon: ''
        }
    },
    mounted() {
        allIcons[`../assets/icons/${this.component}.svg`]().then((mod) => (this.icon = mod.default))
    }
}
</script>

<style lang="scss" scoped>
.tab {
    @apply pl-2 relative cursor-pointer whitespace-nowrap text-white;

    &.active {
        @apply border-b-2 border-white;
    }
}
</style>
