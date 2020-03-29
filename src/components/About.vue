<template>
    <drawer @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>A propos</h2>
        </template>
        <template v-slot:body>
            <p class="ml-5 mr-5 mb-5 xs:text-xs text-base text-justify">MA Vitesse est une application légère,
                intelligente et
                moderne de calculs pour activités sportives telles que la course à pied, le vélo, la randonnée. Elle a
                pour ambition
                de devenir une alternative légère aux cadors (Strava, Endomondo).
                Elle repose sur un principe de transparence : l'application ne collecte pas de données autre que pour
                sauvegarder l'historique
                du sportif ou de la sportive en tout anonymat et sans utilisation commerciale.
                L'application est en constante évolution de l'expérience utilisateur via un ajout régulier de
                fonctionnalités.</p>
            <p class="ml-5 mr-5 xs:text-xs text-base text-justify">
                L'application est 100% gratuite et ses fonctions basiques le seront pour toujours.
                Ma Vitesse fait partie du groupe d'aplications Mean Apps, une bibliothèque d'outils basée sur
                des principes de modernité, sobriété, simplicité et d'efficacité. Ces valeurs s'associent à un souhait
                profond de développement éthique et durable.
            </p>
            <p class="ml-5 mr-5 mt-5 text-base text-center">
                <b>Développeur ?</b> <a class="link" href="mailto:contact@ma-vitesse.app">Contactez-nous</a> pour
                rejoindre le projet.</p>

            <div class="flex flex-col items-center justify-center mt-10">
                <div class="mb-6">
                    <span @click="isModalSuggestFeature = true"
                          class="mv-btn">
                        Proposer une fonctionnalité
                    </span>

                </div>
                <a class="mt-2" href="https://www.patreon.com/bePatron?u=27939606" target="_blank">
                    <span class="mv-btn">Soutenir le projet</span>
                </a>

            </div>
            <p class="ml-5 mr-5 mt-5 text-base text-center">

            </p>
            <p class="ml-5 mr-5 mt-5 text-base text-center">
      <span class="text-primary h-6 sm:hidden xs:hidden">v{{ version }} - Proposé par <a class="link"
                                                                                         href="https://www.linkedin.com/in/arthur-bri%C3%A8re/"
                                                                                         target="_blank">Arthur Brière</a></span>
            </p>
            <suggest-feature @close="closeModalSuggestFeature" v-show="isModalSuggestFeature"/>
        </template>
    </drawer>
</template>

<script>
    import Drawer from '@/components/Drawer'
    import About from '@/components/About'
    import SuggestFeature from '@/components/SuggestFeature'
    import {version} from '../../package.json';

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
        components: {SuggestFeature, About, Drawer},
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
        transition: all 500ms;

        &:hover {
            text-decoration-color: $ma-primary;
        }
    }
</style>