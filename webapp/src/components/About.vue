<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>{{ $t('about.title')}}</h2>
        </template>
        <template v-slot:body>
            <p class="ml-5 mr-5 mb-5 text-base text-justify">{{ $t('about.1st_section') }}</p>
            <p class="ml-5 mr-5 text-base text-justify">{{ $t('about.2nd_section') }}</p>
            <p class="ml-5 mr-5 mt-5 text-base text-center">
                <b>{{ $t('about.dev_label')}} ? </b>
                <a class="link" href="mailto:contact@ma-vitesse.app">{{ $t('about.dev_contact_us')}}</a>
                {{ $t('about.dev_to_join_message')}}
            </p>
            <div class="flex flex-col items-center justify-center mt-10">
                <div class="mb-6">
                    <span @click="isModalSuggestFeature = true" class="mv-btn">{{ $t('about.btn_feature') }}</span>

                </div>
                <a class="mt-2" href="https://www.patreon.com/bePatron?u=27939606" rel="noreferrer" target="_blank">
                    <span class="mv-btn">{{ $t('about.btn_support') }}</span>
                </a>

            </div>
            <p class="ml-5 mr-5 mt-5 text-base text-center">

            </p>
            <p class="ml-5 mr-5 mt-5 text-base text-center">
                <span class="text-primary h-6 sm:hidden">{{ version }} - {{ $t('about.initiated_by') }}
                <a class="link" href="https://www.linkedin.com/in/arthur-bri%C3%A8re/" rel="noreferrer" target="_blank">Arthur Brière</a></span>
            </p>
            <suggest-feature @close="closeModalSuggestFeature" v-show="isModalSuggestFeature"/>
        </template>
    </drawer>
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import SuggestFeature from '@/components/SuggestFeature.vue'
import { version } from '../../package.json'

export default {
    name: "About",
    data() {
        return {
            version: version,
            isModalVisible: false,
            isModalAbout: false,
            isModalSuggestFeature: false
        }
    },
    components: {SuggestFeature, Drawer},
    methods: {
        closeModal() {
            this.isModalVisible = false;
        },
        close() {
            this.$emit('close');
        },
        closeModalSuggestFeature() {
            this.isModalSuggestFeature = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .link {
        text-decoration: underline;
        text-decoration-color: $ma-secondary;

        &:hover {
            text-decoration-color: $ma-primary;
        }
    }
</style>