<template>
    <transition name="modal-fade">
        <div class="allma-modal z-50 fixed left-0 top-0 w-full h-full flex flex-col justify-center content-center" v-show="isModalVisible">
            <div class="header flex justify-between items-stretch">
                <div class="header-start" />
                <div class="header-center">
                    <h2
                        class="
                            noselect-nodrag
                            text-white
                            pt-4
                            text-center text-3xl
                            ml-10
                            mr-10
                            sm:text-xl sm:m-3 sm:mb-0
                            md:text-xl md:mt-2
                            lg:text-2xl
                        "
                    >
                        {{ $t('all_ma.title') }}
                    </h2>
                </div>
                <div class="header-end absolute"></div>
                <img
                    @click="close"
                    alt="close dialog"
                    class="icon-close sm:h-4 md:h-5 lg:h-6 xl:h-6 noselect-nodrag"
                    src="../assets/icons/cancel.svg"
                />
            </div>
            <div class="body flex self-center">
                <div class="flex items-stretch justify-center flex-wrap">
                    <div class="row" v-for="item in meanAppsList" :key="item.name">
                        <div
                            @click="openLink(item.url)"
                            :style="[
                                isHovering !== item
                                    ? {
                                          'box-shadow': '0 5px 1px' + item.colors.secondary,
                                          color: item.colors.primary
                                      }
                                    : {
                                          'box-shadow': 'none',
                                          color: item.colors.primary
                                      }
                            ]"
                            @mouseout="isHovering = {}"
                            @mouseover="isHovering = item"
                            class="app-box pl-1 pr-1 flex flex-col bg-white rounded-lg justify-center items-center m-3"
                        >
                            <div class="flex items-center mt-4">
                                <img :src="item.logo" alt="Mean App logo" class="h-24 sm:h-12 xs:h-8" />
                                <span class="text-2xl sm:text-base">{{ item.name }}</span>
                            </div>
                            <span class="p-4 text-justify sm:text-xs">{{ item.description }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Settings',
    data() {
        return {
            isModalVisible: true,
            isHovering: {},
            meanAppsList: {}
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        openLink(link) {
            window.open(link, '_blank')
        }
    },
    watch: {},
    mounted() {
        axios.defaults.baseURL = import.meta.env.NODE_ENV === 'development' ? 'http://localhost:80' : import.meta.env.BASE_URL

        // Make a request for a user with a given ID
        const ax = axios.create()
        ax.get('/meanapps')
            .then((response) => {
                // handle success
                this.meanAppsList = response.data
            })
            .catch(function (error) {
                // handle error
                console.log(error)
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

    &:hover {
        cursor: pointer;
        transform: scale(1.1);
    }
}

.allma-modal {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    @apply flex justify-center z-40;
}

.app-box {
    cursor: pointer;
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

.header {
    @apply h-8 p-3 mt-2;
    @apply sm:p-4 sm:mt-3;
    @apply xl:h-16 xl:pl-6 xl:pr-6 xl:mt-2;
}

.header {
    @apply flex flex-row items-center justify-between w-full;
}
</style>
