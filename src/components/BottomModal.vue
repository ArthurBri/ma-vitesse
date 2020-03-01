<template>
    <transition name="modal-fade">
        <div class="modal-backdrop z-10" role="dialog">
            <div class="modal w-4/5 rounded-t-lg sm:w-full xs:w-full sm:rounded-none xs:rounded-none" ref="modal">
                <header class="modal-header text-xl text-white sm:text-primary xs:text-primary font-bold bg-primary xs:bg-transparent sm:bg-transparent xs:border-t-4 sm:border-t-4 xs:border-secondary sm:border-secondary">
                    <slot name="header"/>
                </header>
                <section class="modal-body">
                    <slot name="body"/>
                </section>
                <footer class="modal-footer">
                    <slot name="footer">
                        <button @click="close" aria-label="Close modal"
                                class="btn noselect-nodrag outline-none" type="button">
                            Fermer
                        </button>
                    </slot>
                </footer>
            </div>
        </div>
    </transition>

</template>

<script>
    export default {
        name: "BottomModal",
        methods: {
            close() {
                this.$emit('close');
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
        backdrop-filter: blur(3px);
        align-items: flex-end;
    }

    .modal {
        @apply border border-primary bg-white;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        z-index: 3;
        bottom: 0;
    }

    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }


    .modal-header {
        border-bottom: 1px solid #eeeeee;
        justify-content: space-between;
        align-items: center;
    }

    .modal-footer {
        border-top: 1px solid #eeeeee;
        justify-content: flex-end;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
        overflow-x: auto;
        max-height: 40vh;
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
        color: white;
        background: $ma-primary;
        border: 1px solid #4aae9b;
        border-radius: 2px;
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

    .modal-fade-enter,
    .modal-fade-leave-active {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.5s ease;
    }

</style>