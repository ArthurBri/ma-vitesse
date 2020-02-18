<template>
    <bottom-modal @close="close" v-show="isModalVisible">
        <template v-slot:header>
            <h2>Proposer une fonctionnalité</h2>
        </template>
        <template v-slot:body>
            <p class="ml-5 mr-5 mb-5 text-base text-justify">MA Vitesse se construit grâce aux idées de ses
                utilisateurs.
                Proposez ci-dessous une fonctionnalité que vous souhaiteriez voir integrée à l'application. Si elle
                correspond à notre vision de l'appli, nous l'intégrerons dans les semaines à venir. &#127881; </p>
            <div class="ml-5 flex flex-col justify-start content-start">
                <label class="font-bold text-left" for="suggest">Dans MA Vitesse, je voudrais...</label>
                <textarea class="mt-2 mr-5 p-2 border border-primary rounded h-20 outline-none text-gray-900"
                          placeholder="Pouvoir sauvegarder mes courses"
                          cols="40" id="suggest"
                          v-model="suggestDescription"
                          rows="5"/>
                <label class="font-bold text-left mt-2" for="mail-suggest">Une adresse mail ?<span
                        class="ml-2 font-light text-xs">Pour vous tenir informé ou vous demander plus de précisions </span></label>
                <input class="mt-2 mr-5 p-2 outline-none border border-primary rounded text-gray-900"
                       id="mail-suggest" v-model="suggestContributorEmail"
                       placeholder="jecoursvite@mail.com"/>
            </div>
            <button @click="submitForm" class="bg-secondary p-2 mt-2 rounded text-white outline-none"
                    v-if="!maxSuggestRate">{{ buttonLabel
                }}
            </button>
            <p class="mt-2" v-else>Vous avez déjà partagé une superbe idée aujourd'hui, merci. Revenez demain !</p>


        </template>
        <template @click="close" v-slot:footer/>
    </bottom-modal>
</template>

<script>
    import BottomModal from '@/components/BottomModal'
    import {version} from '../../package.json';

    export default {
        name: "SuggestFeature",
        data() {
            return {
                version: version,
                isModalVisible: false,
                suggestDescription: '',
                suggestContributorEmail: '',
                buttonLabel: 'Envoyer',
                maxSuggestRate: false
            }
        },
        components: {BottomModal},
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
                const ax = axios.create({
                    baseURL: 'http://localhost:80'
                });
                ax.post('/featuresuggests', {
                    description: this.suggestDescription,
                    contributor_email: this.suggestContributorEmail
                })
                    .then((response) => {
                        this.buttonLabel = response.status === 201 ? "Nous prenons note, merci !" : "Oups, il y a eu un souci ! Réessayez pour voir ?";
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