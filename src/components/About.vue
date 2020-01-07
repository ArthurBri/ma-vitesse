<template>
    <modal @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>A propos</h2>
            <p>v{{ version }}</p>
        </template>
        <template v-slot:body>
            <p class="ml-5 mr-5 mb-5 text-base text-justify">Ma Vitesse est une application légère, intelligente et
                moderne de calcul et d'estimations de temps de
                course.
                Conçue initialement pour la course à pied et de manière statique (pré et post sortie), elle a pour but
                de devenir une alternative légère aux cadors (Strava, Endomondo).
                L'idée repose sur une application qui ne collecte pas de données autre que pour sauvegarder l'historique
                du coureur (c'est-à-dire en connaissance explicite de cause et sans but financier).
                Le développeur travaille en parmanence pour améliorer l'expérience et les fonctionnalités.</p>
            <p class="ml-5 mr-5 mb-5 text-base text-center">
                <b>Développeur ?</b> <a class="link" href="mailto:contact@ma-vitesse.app">Contactez-nous</a> pour
                échanger sur notre vision du projet et définir sa finalité.</p>
            <p class="ml-5 mr-5 text-base text-justify">
                L'application est 100% gratuite et ses fonctions basiques le resterons. Elle bénéficie de mises à jours
                régulières transparentes pour l'utilisateur (jusqu'à plusieurs par semaine).
                Ma Vitesse fait partie du groupe d'aplications Mean Apps, une bibliothèque d'outils en devenir basée sur
                ces
                valeurs : modernité, sobriété, simplicité, efficacité, légèreté
                Ces valeurs recoupent avec les valeurs environnementales et éthiques des développeurs.
                Pour soutenir cette application et les Mean Apps, vous pouvez nous soutenir via <a class="link"
                                                                                                   href="https://www.patreon.com/bePatron?u=27939606"
                                                                                                   target="_blank">Patreon</a>.
            </p>
        </template>
        <template @click="close" v-slot:footer/>
    </modal>
</template>

<script>
    import Modal from '@/components/Modal'
    import {version} from '../../package.json';

    export default {
        name: "About",
        data() {
            return {
                version: version,
                isModalVisible: false,
            }
        },
        components: {Modal},
        methods: {
            closeModal() {
                this.isModalVisible = false;
            },
            close() {
                this.$emit('close');
            },
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