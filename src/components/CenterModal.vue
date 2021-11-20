<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" role="dialog">
            <div :style="{ marginTop: margin_top }" class="modal sm:w-full" ref="modal">
                <header class="modal-header text-xl font-bold">
                    <slot name="header" />
                    <span @click="close" class="pl-2 icon self-start m-1"
                        ><img alt="delete a distance" class="icon-close w-4" src="../assets/icons/cancel.svg"
                    /></span>
                </header>
                <section class="modal-body text-primary">
                    <slot name="body" />
                </section>
                <footer class="modal-footer" v-if="footer === true">
                    <slot name="footer">
                        <button @click="close" aria-label="Close modal" class="btn outline-none" type="button">
                            <slot>{{ $t('common.close') }}</slot>
                        </button>
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Modal.vue',
    methods: {
        close() {
            this.$emit('close')
        }
    },
    props: {
        footer: {
            default: true
        },
        margin_top: {
            default: '10vh'
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    padding: 8px 16px;
    border-radius: 3px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
}

.icon-close {
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(10px);
    align-items: flex-end;
    z-index: 1000;
}

.modal {
    background: #ffffff;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    align-self: start;
    z-index: 3;
    border-radius: 13px;
    width: 30%;
    min-width: 300px;
}

.modal-header,
.modal-footer {
    padding: 15px;
    display: flex;
}

.modal-header {
    @apply text-primary;
    justify-content: space-between;
    align-items: center;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: center;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
    overflow-x: auto;
    max-height: 400px;
}

.btn {
    @apply text-white bg-primary;
    border: 1px solid #4aae9b;
    border-radius: 2px;
}

.slide-up-enter-active {
    transition: all 0.2s ease;
}

.slide-up-leave-active {
    transition: all 2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter,
.slide-fade-leave-to {
    transform: translateY(100vh);
    opacity: 0;
}

.modal-fade-enter,
.modal-fade-leave-active {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.5s ease;
}

.icon {
    filter: invert(37%) sepia(71%) saturate(469%) hue-rotate(170deg) brightness(83%) contrast(98%);
}
</style>
