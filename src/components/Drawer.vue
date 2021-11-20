<template>
    <transition name="slide-left">
        <div @click="handleClick($event.target)" class="drawer-backdrop z-40" role="dialog">
            <div class="drawer w-full xl:w-1/5 lg:w-1/3 md:w-1/2" ref="drawer">
                <header class="drawer-header text-2xl text-white font-bold">
                    <slot name="header" />
                    <button @click="close" aria-label="Close drawer" class="mv-btn-rounded" type="button">
                        <img alt="clear field button" class="h-2 clear-fields-button" src="../assets/icons/cancel.svg" />
                    </button>
                </header>
                <section class="drawer-body">
                    <slot name="body" />
                </section>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Drawer',
    methods: {
        close() {
            this.$emit('close')
        },
        handleClick(target) {
            if (target.className.match('drawer-backdrop')) {
                this.close()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.drawer-backdrop {
    @apply fixed inset-0 flex justify-center items-center transition-none bg-white bg-opacity-40 backdrop-blur-sm;
}

.drawer {
    @apply absolute rounded-lg bg-white backdrop-blur overflow-x-auto flex flex-col z-40 lg:bottom-4 lg:right-4 shadow;
    transition: transform 200ms;
    height: calc(100vh - $footer-height);
}

@screen lg {
    .drawer {
        height: auto;
        max-height: calc(100vh - $footer-height);
    }
}

.drawer-header {
    @apply bg-secondary bg-opacity-80 flex justify-between items-center outline-none h-16 pl-2;
    backdrop-filter: blur(1rem);
}

.drawer-body {
    @apply relative h-full px-2 py-4 overflow-auto;
}

.slide-left-enter-active {
    transform: tanslateX(0%);
}

.slide-left-leave-active {
    transform: tanslateX(0%);
}

.slide-left-enter,
.slide-left-leave-to {
    transform: translateX(100%);
}

.drawer-header {
    @apply px-3 py-2;
}
</style>
