<template>
    <transition name="slide-left">
        <div @click="handleClick($event.target)" class="drawer-backdrop z-40" role="dialog">
            <div class="drawer rounded-b xl:rounded-lg w-full xl:w-1/5 lg:w-1/3 md:w-1/2" ref="drawer">
                <header class="drawer-header text-xl text-white font-bold noselect-nodrag">
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
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    transition: none;
}

.drawer {
    @apply absolute bg-white md:bg-opacity-80 backdrop-blur overflow-x-auto flex flex-col z-40 top-0 right-0 md:mt-2 md:mr-4 shadow;
    transition: transform 200ms;
    height: calc(100vh - 4rem);
}

@screen lg {
    .drawer {
        height: auto;
        max-height: calc(100vh - $footer-height);
    }
}

.drawer-header {
    @apply bg-secondary bg-opacity-80 flex justify-between items-center outline-none p-3;
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
