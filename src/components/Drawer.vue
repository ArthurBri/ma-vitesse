<template>
    <transition name="drawer-fade">
        <div @click="handleClick($event.target)" class="drawer-backdrop z-10" role="dialog">
            <div class="drawer xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-3/4 xs:w-full" ref="drawer">
                <header class="drawer-header text-xl text-white font-bold">
                    <slot name="header"/>
                    <button @click="close" aria-label="Close drawer"
                            class="btn noselect-nodrag outline-none" type="button">
                        {{ $t('common.close')}}
                    </button>
                </header>
                <section class="drawer-body">
                    <slot name="body"/>
                </section>
            </div>
        </div>
    </transition>

</template>

<script>
    export default {
        name: "Drawer",
        methods: {
            close() {
                this.$emit('close');
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
    .btn {
        @apply px-2 py-1 rounded-lg text-base cursor-pointer;
    }

    .drawer-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        -webkit-backdrop-filter: blur(3px);
        backdrop-filter: blur(3px);
        align-items: flex-end;
    }

    .drawer {
        @apply bg-transparent absolute overflow-x-auto flex flex-col z-10 right-0 h-screen;
        box-shadow: 0 0 5px rgba(#63b3ed, 0.8)
    }

    .drawer-header {
        @apply flex px-4 py-3 justify-between items-center outline-none;
        background-color: rgba($ma-primary, 0.4);
        background-image: linear-gradient(to right, rgba($ma-primary, 0), rgba($ma-primary, 1) 72%);
        backdrop-filter: blur(1rem);
    }

    .drawer-body {
        @apply bg-white relative h-full;
        position: relative;
        padding: 20px 10px;
        overflow-x: auto;
    }

    .btn-close {
        border: none;
        font-size: 20px;
        padding: 20px;
        cursor: pointer;
        font-weight: bold;
        color: #4aae9b;
        background: transparent;
    }

    .btn {
        @apply text-white bg-primary border border-white rounded;
    }

    .slide-up-enter-active {
        transition: all .2s ease;
    }

    .slide-up-leave-active {
        transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-up-enter, .slide-fade-leave-to {
        transform: translateY(100vh);
        opacity: 0;
    }

    .drawer-fade-enter,
    .drawer-fade-leave-active {
        opacity: 0;
    }

    .drawer-fade-enter-active,
    .drawer-fade-leave-active {
        transition: opacity 0.5s ease;
    }

</style>