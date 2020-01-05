<template>
    <modal @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>A propos</h2>
            <p>v{{ version }}</p>
        </template>
        <template style="text-align:justify;text-justify: auto" v-slot:body>
            <p>Ma Vitesse est une application légère, intelligente et moderne de calcul et d'estimations de temps de
                course.
                Conçue initialement pour la course à pied et de manière statique (pré et post sortie), elle a pour but
                de devenir une alternative légère aux cadors (Strava, Endomondo)</p>
            <p>L'idée repose sur une application qui ne collecte pas de données autre que pour sauvegarder l'historique
                du coureur (c'est-à-dire en connaissance explicite de cause et sans but financier).</p>
            <p>Le développeur travaille en parmanence pour améliorer l'expérience et les fonctionnalités. </p>
            <p><b>Développeur ?</b> Contactez-nous pour échanger sur ma vision du projet et définir sa finalité</p>
            <p>L'application est 100% gratuite et ses fonctions basiques le resterons. Elle bénéficie de mises à jours
                régulières transparantes pour l'utilisateur (plusieurs par semaine)</p>
            <p>Ma Vitesse fait partie du groupe d'aplications MApps, une bibliothèque d'outils en devenir basés sur ces
                valeurs : modernité, sobriété, simplicité, efficacité, légèreté</p>
            <p>Ces valeurs recoupent avec les valeurs environnementales et éthiques des développeurs.</p>
            <p>Pour soutenir cette application et les MAPS, vous pouvez nous soutenir via Patreon, Paypal</p>
        </template>
        <template @click="close" v-slot:footer/>
    </modal>
</template>

<script>
    import Modal from '@/components/Modal'
    import Footer from "@/components/Footer";
    import {version} from '../../package.json';

    export default {
        name: "About.vue",
        data() {
            return {
                version: version,
                isModalVisible: false,
            }
        },
        components: {Footer, Modal},
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

</style>