<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>{{ $t('suggest_feature.title') }}</h2>
        </template>
        <template v-slot:body>
            <p class="ml-5 mr-5 mb-5 text-base text-justify">{{ $t('suggest_feature.description') }} &#127881;</p>
            <div class="ml-5 flex flex-col justify-start content-start">
                <label class="font-bold text-left" for="suggest">{{ $t('suggest_feature.suggest_label') }}</label>
                <textarea
                    class="mt-2 mr-5 p-2 bg-gray-200 focus:shadow text-primary rounded h-20 outline-none"
                    :placeholder="$t('suggest_feature.suggest_label_placeholder')"
                    cols="40"
                    id="suggest"
                    v-model="suggestDescription"
                    rows="5"
                />
                <label class="font-bold text-left mt-2" for="mail-suggest"
                    >{{ $t('suggest_feature.suggest_email')
                    }}<span class="ml-2 font-light text-xs">{{ $t('suggest_feature.suggest_email_tip') }} </span></label
                >
                <input
                    class="mt-2 mr-5 p-2 outline-none bg-gray-200 focus:shadow text-primary rounded"
                    id="mail-suggest"
                    v-model="suggestContributorEmail"
                    :placeholder="$t('suggest_feature.suggest_email_placeholder')"
                />
            </div>
            <div class="mt-4 flex justify-center">
                <button @click="shareSuggestion" class="vi-btn">
                    {{ buttonLabel }}
                </button>
            </div>
        </template>
        <template @click="close" v-slot:footer />
    </drawer>
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import { version } from '../../package.json'
import { nanoid } from 'nanoid'
import { setDoc, doc } from 'firebase/firestore/lite'

export default {
    name: 'FeatureSuggestion',
    data() {
        return {
            version: version,
            isModalVisible: false,
            suggestDescription: '',
            suggestContributorEmail: '',
            buttonLabel: this.$t('suggest_feature.btn_send')
        }
    },
    components: { Drawer },
    methods: {
        closeModal() {
            this.isModalVisible = false
        },
        close() {
            this.$emit('close')
        },
        async shareSuggestion() {
            const id = nanoid()

            await setDoc(doc(this.$db, 'suggestions', id), {
                description: this.suggestDescription,
                contributor_email: this.suggestContributorEmail,
                creationDate: new Date().toISOString()
            })
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
