<template>
    <transition name="modal-fade">
        <div class="allma-modal z-10 fixed left-0 top-0 w-full h-full flex flex-col justify-center content-center"
             v-show="isModalVisible">
            <div class="header flex justify-between items-stretch">
                <div class="header-start"/>
                <div class="header-center">
                    <h2 class="noselect-nodrag text-white pt-4 text-center text-3xl ml-10 mr-10 xs:text-lg xs:m-4 xs:mb-0 sm:text-xl sm:m-3 sm:mb-0 md:text-xl md:mt-2 lg:text-2xl">
                        Toutes nos applications</h2>
                </div>
                <div class="header-end absolute">
                </div>
                <img @click="close" alt="close dialog"
                     class="icon-close xs:h-4 sm:h-4 md:h-5 lg:h-6 xl:h-6 noselect-nodrag "
                     src="../assets/icons/cancel.svg"/>
            </div>
            <div class="body flex self-center">
                <div class="flex items-stretch justify-center flex-wrap">
                    <div class="row" v-for="(item) in meanAppsList">
                        <div @click="openLink(item.url)"
                             :style="[isHovering !== item ? { 'box-shadow' : '0 5px 1px' + item.colors.secondary,
                                       'color' : item.colors.primary} : { 'box-shadow' : 'none', 'color' : item.colors.primary}]"
                             @mouseout="isHovering = {}"
                             @mouseover="isHovering = item"
                             class="app-box pl-1 pr-1 flex flex-col bg-white rounded-lg flex justify-center items-center m-3">
                            <div class="flex items-center mt-4">
                                <!--suppress HtmlUnknownTarget -->
                                <img :src="item.logo" alt="Mean App logo" class="h-24 sm:h-12 xs:h-8"/>
                                <span class="text-2xl sm:text-base xs:text-base">{{ item.name}}</span>
                            </div>
                            <span class="p-4 text-justify sm:text-xs xs:text-xs">{{ item.description}}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>

    export default {
        name: "Settings",
        data() {
            return {
                isModalVisible: true,
                isHovering: {},
                meanAppsList: {}
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            openLink(link) {
                window.open(link, '_blank');
            }
        },
        watch: {},
        mounted() {
            const axios = require('axios');
            axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL;

            // Make a request for a user with a given ID
            const ax = axios.create();
            ax.get('/meanapps')
                .then(response => {
                    // handle success
                    this.meanAppsList = response.data
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }
</script>

<style lang="scss" scoped>

    .body {
        @apply flex justify-center align-middle w-4/5 mt-12;
    }

    .icon-close {
        right: 0;
        filter: grayscale(100%);
        transition: all 100ms;

        &:hover {
            cursor: pointer;
            transform: scale(1.1)
        }
    }

    .allma-modal {
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        transition: all 200ms;
        @apply flex justify-center;
    }


    .app-box {
        cursor: pointer;
        transition: all 200ms;
        margin-bottom: 15px;

        &:hover {
            margin-top: 15px;
            margin-bottom: 10px;
        }
    }

    .modal-fade-enter,
    .modal-fade-leave-active {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.5s ease;
    }

    /* <= 379px */
    @screen xs {
        .header {
            @apply h-8 p-3 mt-2;
        }
    }

    /* 380px < width > 639px  */
    @screen sm {
        .header {
            @apply h-8 p-3 mt-2;
        }
    }

    /* 640px < width > 767px */
    @screen md {
        .header {
            @apply h-8 p-4 mt-3;
        }
    }

    /* 768px < width > 1023px */
    @screen lg {
        .header {
            @apply h-8 p-4 mt-3;
        }
    }

    /* > 1024px */
    @screen xl {
        .header {
            @apply h-16 p-4 pl-6 pr-6 mt-2;
        }
    }

    .header {
        @apply flex flex-row items-center justify-between w-full;
    }
</style>