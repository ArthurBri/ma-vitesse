<template>
    <transition name="slide-left">
        <div @click="handleClick($event.target)" class="drawer-backdrop z-40" role="dialog">
            <div class="drawer rounded-lg xl:w-1/5 lg:w-1/3 md:w-1/2 sm:w-3/4" ref="drawer">
                <header class="drawer-header text-xl text-white font-bold noselect-nodrag">
                    <slot name="header" />
                    <button @click="close" aria-label="Close drawer" class="mv-btn bg-white text-sm" type="button">
                        {{ $t('common.close') }}
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
    @apply bg-white absolute overflow-x-auto flex flex-col z-40 top-0 right-0 mt-2 mr-4 shadow-xl;
    max-height: 80vh;
}

.drawer-header {
    @apply flex justify-between items-center outline-none;
    background-color: rgba($ma-primary, 0.8);
    backdrop-filter: blur(1rem);
}

.drawer-body {
    @apply relative h-full;
    position: relative;
    padding: 20px 10px;
    overflow-x: auto;
}

.slide-left-enter-active {
    transition: 200ms;
}

.slide-left-leave-active {
    transition: 200ms;
}

.slide-left-enter,
.slide-left-leave-to {
    transform: translateX(100vw);
}

.drawer-header {
    @apply px-3 py-2;
}

@screen sm {
    .slide-left-enter,
    .slide-left-leave-to {
        transform: translateX(25vw);
    }

    .drawer-header {
        @apply p-3;
    }
}

@screen md {
    .slide-left-enter,
    .slide-left-leave-to {
        transform: translateX(50vw);
    }

    .drawer-header {
        @apply p-3;
    }
}

@screen lg {
    .slide-left-enter,
    .slide-left-leave-to {
        transform: translateX(33.3vw);
    }

    .drawer-header {
        @apply px-3 py-4;
    }
}

@screen xl {
    .slide-left-enter,
    .slide-left-leave-to {
        transform: translateX(20vw);
    }

    .drawer-header {
        @apply px-3 py-4;
    }

    .drawer {
        min-width: 260px;
    }
}
</style>
