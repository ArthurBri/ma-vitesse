<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>{{ $t('suggest_feature.title') }}</h2>
        </template>
        <template v-slot:body>
            <p class="ml-5 mr-5 mb-5 text-base text-justify">{{ $t('suggest_feature.description') }} &#127881; </p>
            <div class="ml-5 flex flex-col justify-start content-start">
                <label class="font-bold text-left" for="suggest">{{ $t('suggest_feature.suggest_label') }}</label>
                <textarea
                        class="mt-2 mr-5 p-2 bg-gray-200 focus:shadow-lg text-primary placeholder-gray-600 rounded h-20 outline-none"
                        :placeholder="$t('suggest_feature.suggest_label_placeholder')"
                        cols="40" id="suggest"
                        v-model="suggestDescription"
                        rows="5"/>
                <label class="font-bold text-left mt-2" for="mail-suggest">{{ $t('suggest_feature.suggest_email')
                    }}<span
                            class="ml-2 font-light text-xs">{{ $t('suggest_feature.suggest_email_tip') }} </span></label>
                <input class="mt-2 mr-5 p-2 outline-none bg-gray-200 focus:shadow-lg text-primary placeholder-gray-600 rounded"
                       id="mail-suggest" v-model="suggestContributorEmail"
                       :placeholder=" $t('suggest_feature.suggest_email_placeholder')"/>
            </div>
            <div class="mt-4 flex justify-center">
                <button @click="submitForm" class="mv-btn"
                        v-if="!maxSuggestRate">{{ buttonLabel }}
                </button>
                <p class="mt-2 text-center" v-else>{{ $t('suggest_feature.suggest_limit_message') }}</p>
            </div>
        </template>
        <template @click="close" v-slot:footer/>
    </drawer>
</template>

<script>
    import Drawer from '@/components/Drawer'
    import {version} from '../../package.json';

    export default {
        name: "SuggestFeature",
        data() {
            return {
                version: version,
                isModalVisible: false,
                suggestDescription: '',
                suggestContributorEmail: '',
                buttonLabel: this.$t('suggest_feature.btn_send'),
                maxSuggestRate: false
            }
        },
        components: {Drawer},
        mounted() {
            if (localStorage.maxSuggestRate) {
                this.maxSuggestRate = localStorage.maxSuggestRate;
            }
        },
        methods: {
            closeModal() {
                this.isModalVisible = false;
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                const axios = require('axios');
                // Make a request for a user with a given ID
                axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL;
                const ax = axios.create();
                ax.post('/featuresuggests', {
                    description: this.suggestDescription,
                    contributor_email: this.suggestContributorEmail
                })
                    .then((response) => {
                        this.buttonLabel = response.status === 201 ? this.$t('suggest_feature.btn_sent_ok') : this.$t('suggest_feature.btn_sent_ko');
                        if (response.status === 201) {
                            localStorage.maxSuggestRate = true;
                            setTimeout(() => {
                                this.maxSuggestRate = true;
                                this.suggestContributorEmail = '';
                                this.suggestDescription = '';
                                this.close();
                            }, 4000)
                        }
                    })
                    .catch((error) => {
                        this.maxSuggestRate = error.response.status === 429;
                        localStorage.maxSuggestRate = this.maxSuggestRate;
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .link {
        text-decoration: underline;
        text-decoration-color: $ma-secondary;
        transition: all 500ms;

        &:hover {
            text-decoration-color: $ma-primary;
        }
    }
</style>