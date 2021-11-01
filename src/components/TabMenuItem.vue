<template>
    <div class="tab" :class="isActive && 'active'" v-show="isVisible">
        <div class="flex h-8 mt-1 ml-1 mr-1 pb-1 leading-none font-light">
            <img :class="!isActive && 'icon-inactive'" :src="icon" alt="Component icon" class="w-6 noselect-nodrag" />
            <h2 class="noselect-nodrag self-center pl-2 font-semibold cursor-pointer">
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
    @apply pl-2 relative rounded-lg bg-white border-gray-200 border cursor-pointer;

    &.active {
        @apply bg-primary text-white;
    }
}

.icon-inactive {
    filter: invert(28%) sepia(68%) saturate(797%) hue-rotate(176deg) brightness(100%) contrast(83%);
}
</style>
