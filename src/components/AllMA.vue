<template>
    <transition name="modal-fade">
        <div class="allma-modal z-10 fixed left-0 top-0 w-full h-full flex flex-col justify-center content-center"
             v-show="isModalVisible">
            <div class="header flex justify-between items-stretch">
                <div class="header-start"/>
                <div class="header-center w-1/2">
                    <h2 class="noselect-nodrag text-4xl p-10 text-white text-center">Toutes nos applications</h2>
                </div>
                <div class="header-end">
                </div>
                <img @click="close" alt="close dialog"
                     class="icon-close w-16 h-10 mt-8 mr-8 noselect-nodrag absolute"
                     src="../assets/icons/cancel.svg"/>
            </div>
            <div class="body flex self-center">
                <div class="flex items-stretch justify-center flex-wrap">
                    <div class="row" v-for="(item) in meanAppsList">
                        <div @click="openLink(item.url)"
                             class="app-box w-64 pl-1 pr-1 flex flex-col bg-white rounded-lg text-primary flex justify-center items-center m-3">
                            <div class="flex items-center mt-4">
                                <!--suppress HtmlUnknownTarget -->
                                <img :src="item.logo" alt="Mean App logo" class="h-24"/>
                                <span class="text-2xl">{{ item.name}}</span>
                            </div>
                            <span class="p-4 text-justify">{{ item.description}}</span>
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
            console.log("PROCESSS ENV : ", process.env.BASE_URL);
            const axios = require('axios');
            axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL

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
        @apply flex justify-center align-middle w-4/5;
    }

    .link {
        text-decoration: underline;
        text-decoration-color: $ma-secondary;
        transition: all 500ms;

        &:hover {
            text-decoration-color: $ma-primary;
        }
    }

    .icon-close {
        right: 0%;
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
        box-shadow: 0 5px 1px rgba(255, 153, 0, 0.8);
        cursor: pointer;
        transition: all 200ms;
        margin-bottom: 15px;

        &:hover {
            box-shadow: none;
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
</style>